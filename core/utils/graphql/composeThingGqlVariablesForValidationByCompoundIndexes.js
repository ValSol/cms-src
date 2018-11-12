import isArray from '../is/isArray';
import getMultipleParams from '../fields/getMultipleParams';
// функция возвращает массив массивов переменных (variables) используемых ...
// ... в gql запросах вида:
/*
export default gql`
query article($subject: String!, $section: String!, $slug: String!) {
  article(subject: $subject, section: $section, slug: $slug) {
    _id
  }
}
*/
// соответствующих членам составных индексов из compoundIndexFieldSets
// и формируемых утилитой composeThingGqlVariablesForValidationByCompoundIndexes.gql.js
// т.е. для формирования каждого gql-запроса используется:
// 1) текст запроса формируемый composeThingGqlVariablesForValidationByCompoundIndexes.gql.js
// 2) значения переменных формируемые composeThingGqlVariablesForValidationByCompoundIndexes.js
// на входе
// thingConfig - конфигурация текущей thing
// values - атрибуты текущей thing
// на выходе
// массив - по длине соовтеттствующий количеству сетов в compoundIndexFieldSets
// и содержащий массивы наборов переменных которых должны использоваться с данным
// запросом

// вспомогательная функция формирующая переменные
// для очередного конкретного набора полей из compoundIndexFieldSets
// эта функция практически идетичная вспомогательной функции ...
// ... processPararmNameSet используемой в утилите: composeExcerptFields

const composeValuesForSet = (set, values, multipleParams, results = [{}]) => {
  const set2 = [...set]; // клонируем set

  // если перебраны все члены set возвращаем results;
  if (!set2.length) return results;
  // в противном случае отрабатываем первый из оставшихся элементов набора
  const fieldName = set2[0];

  let results2;

  if (multipleParams[fieldName]) {
    // если submit (blurredFieldName === undefined) и ...
    // ... значение - параметра - НЕ массив - ошибка
    if (!isArray(values[fieldName])) {
      throw new TypeError(
        `The value of multiple param "${fieldName}" has to be array!`,
      );
    }

    results2 = values[fieldName].reduce((prev, paramValue) => {
      // значение не определено - ошибка!
      if (!paramValue) {
        throw new TypeError(
          `Required "${fieldName}" field has "${paramValue}" value!`,
        );
      }
      // получаем для каждого значения paramValue массив объектов: results3...
      const results3 = results.map(item => ({
        ...item,
        [fieldName]: paramValue,
      }));
      // ... и помещаем его в итоговый массив
      prev.push(...results3);
      return prev;
    }, []);
  } else {
    // если значение поля скаляр
    results2 = results.map(item => ({
      ...item,
      [fieldName]: values[fieldName] || '',
    }));
  }

  // отбрасываем первый элемент сета ...
  set2.shift();
  // и переходим к отработке следующего элемента сета ...
  // ... с уже частично заполненным массивом результатов
  return composeValuesForSet(set2, values, multipleParams, results2);
};

const composeThingGqlVariablesForValidationByCompoundIndexes = (
  thingConfig,
  values,
  blurredFieldName,
) => {
  // получаем все поля необходимые для построения запроса
  const { compoundIndexFieldSets, paramFields } = thingConfig;
  const multipleParams = getMultipleParams(thingConfig);

  // готовим массив имен параметров, например: ['subject', 'section']
  const paramFieldNames = paramFields.map(({ name }) => name);

  // готовим массив массивов имен полей включенных в составные индексы
  // напримерм: [['subject', 'section', 'slug']]
  // попутно отфильтровывая наборы которые нет возможности валидировать
  const compoundIndexFieldNameSets = compoundIndexFieldSets
    .map(set => set.map(({ name }) => name))
    .filter(
      // точно такую же фильтрацию используем в composeThingGqlQueriesByCompoundIndexes
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
    );

  const variablesSets = compoundIndexFieldNameSets.map(set =>
    composeValuesForSet(set, values, multipleParams),
  );

  // готовим массив имен полей которые НЕ являются параметрами (например slug)
  // в каждом составном индексе таких полей ровно 1 штука
  const notParamFieldNamesInUse = compoundIndexFieldNameSets.reduce(
    (prev, set, i) => {
      const notParamFieldName = set.reduce((prev2, name) => {
        // eslint-disable-next-line no-param-reassign
        if (!paramFieldNames.includes(name)) prev2 = name;
        return prev2;
      }, null);
      const { length } = variablesSets[i];
      const addedArray = Array(length).fill(notParamFieldName);
      return prev.concat(addedArray);
    },
    [],
  );
  return { notParamFieldNamesInUse, variablesSets };
};

export default composeThingGqlVariablesForValidationByCompoundIndexes;
