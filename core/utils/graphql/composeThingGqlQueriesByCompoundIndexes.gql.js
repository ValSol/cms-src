import gql from 'graphql-tag';

import composeGql from './composeGql';
// функция возвращает массив запросов соответствующих
// членам составных индексов из compoundIndexFieldSets
// функций возвращает запросы вида
/*
export default gql`
query article($subject: String!, $section: String!, $slug: String!) {
  article(subject: $subject, section: $section, slug: $slug) {
    _id
  }
}
*/

// кеш для уже построенных запросов
const thingByCompoundIndexesMembersArray = [];

// вспомогательная функция формирующся входные аргументы
// для запроса в зависимости от членов сложного индекса
const composeInputArgs = args => args.map(name => ({ name, type: 'String!' }));

const composeThingGqlQueriesByCompoundIndexes = (
  thingConfig,
  values,
  blurredFieldName,
) => {
  // получаем все поля необходимые для построения запроса
  const { compoundIndexFieldSets, paramFields, thingName } = thingConfig;
  // если такая мутация уже была построена - просто возвращаем его
  // при условии что запросы строятся НЕ для валидации (values === undefined)
  if (thingByCompoundIndexesMembersArray[thingName] && values === undefined) {
    return thingByCompoundIndexesMembersArray[thingName];
  }

  // конструируем имя запроса
  const queryName = `${thingName.toLowerCase()}`;
  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // это всег лишь одно поле _id
  const fields = {
    _id: null,
  };
  // сохраняем созданный запрос в кеше если values не заданы...
  // т.е. строим запросы НЕ для валидации
  if (values === undefined) {
    thingByCompoundIndexesMembersArray[thingName] = compoundIndexFieldSets
      .map(set => set.map(({ name }) => name))
      .map(set =>
        gql(composeGql(queryName, composeInputArgs(set), [], fields)),
      );
    // ... и возвращаем его
    return thingByCompoundIndexesMembersArray[thingName];
  }
  // готовим массив имен параметров, например: ['subject', 'section']
  const paramFieldNames = paramFields.map(({ name }) => name);

  // в случае когда строим запросы для валидации НЕ используем кеш
  // и отфильтровываем неподходящие для валидации запросы
  return compoundIndexFieldSets
    .map(set => set.map(({ name }) => name))
    .filter(
      // точно такую же фильтрацию используем в composeThingGqlVariablesForValidationByCompoundIndexes
      set =>
        // если blurredFieldName = undefined т.е. если submit или ...
        // ... если blurredFieldName входит в состав текущего набора (set)
        (blurredFieldName === undefined || set.includes(blurredFieldName)) &&
        set.every(
          fieldName =>
            // при этом если есть НЕ установленные значения - валидацию НЕ проводим
            // values[fieldName].length - обозначает что будь-то строка или массив строк...
            // ...строка должна быть НЕ нулевая и массив строк должен быть НЕ пуст
            !paramFieldNames.includes(fieldName) ||
            (values[fieldName] && values[fieldName].length),
        ),
    )
    .map(set => gql(composeGql(queryName, composeInputArgs(set), [], fields)));
};

export default composeThingGqlQueriesByCompoundIndexes;
