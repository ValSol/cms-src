import isArray from '../is/isArray';
import getMultipleParams from '../fields/getMultipleParams';
// функция возвращает массив массивов переменных (variables) ...
// ... используемых в gql запросах вида
/*
export default gql`
query article($subject: String!, $section: String!, $slug: String!) {
  article(subject: $subject, section: $section, slug: $slug) {
    _id
  }
}
*/
// соответствующих членам составных индексов из compoundIndexFieldSets
// и формируемых утилитой composeThingGqlVariablesByCompoundIndexes.gql.js
// т.е. для формирования каждого gql-запроса используется:
// 1) текст запроса формируемый composeThingGqlVariablesByCompoundIndexes.gql.js
// 2) значения переменных формируемые composeThingGqlVariablesByCompoundIndexes.js
// на входе
// thingConfig - конфигурация текущей thing
// thing - атрибуты текущей thing
// на выходе
// массив - по длине соовтеттствующий количеству сетов в compoundIndexFieldSets
// и содержащий массивы наборов переменных которых должны использоваться с данным
// запросом

// вспомогательная функция формирующая переменные
// для очередного конкретного набора полей из compoundIndexFieldSets
// эта функция практически идетичная вспомогательной функции ...
// ... processPararmNameSet используемой в утилите: composeExcerptFields

const composeValuesForSet = (set, thing, multipleParams, results = [{}]) => {
  const set2 = [...set]; // клонируем set

  // если перебраны все члены set возвращаем results;
  if (!set2.length) return results;
  // в противном случае отрабатываем первый из оставшихся элементов набора
  const fieldName = set2[0];

  let results2;

  if (multipleParams[fieldName]) {
    // если значение - параметра - НЕ массив - ошибка
    if (!isArray(thing[fieldName])) {
      throw new TypeError(
        `The value of multiple param "${fieldName}" has to be array!`,
      );
    }
    // массив НЕ заполнен - ошибка
    if (!thing[fieldName].length) {
      throw new TypeError(`Array of params "${fieldName}" has no items!`);
    }
    results2 = thing[fieldName].reduce((prev, paramValue) => {
      // значение не определено - ошибка!
      if (paramValue === undefined) {
        throw new TypeError(`Undefined required "${fieldName}" field value!`);
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
    // значение не определено - ошибка!
    if (thing[fieldName] === undefined) {
      throw new TypeError(`Undefined required "${fieldName}" param value!`);
    }
    // если значение - параметра - скаляр
    results2 = results.map(item => ({
      ...item,
      [fieldName]: thing[fieldName],
    }));
  }

  // отбрасываем первый элемент сета ...
  set2.shift();
  // и переходим к отработке следующего элемента сета ...
  // ... с уже частично заполненным массивом результатов
  return composeValuesForSet(set2, thing, multipleParams, results2);
};

const composeThingGqlVariablesByCompoundIndexes = (thingConfig, thing) => {
  // получаем все поля необходимые для построения запроса
  const { compoundIndexFieldSets } = thingConfig;
  const multipleParams = getMultipleParams(thingConfig);

  return compoundIndexFieldSets
    .map(set => set.map(({ name }) => name))
    .map(set => composeValuesForSet(set, thing, multipleParams));
};

export default composeThingGqlVariablesByCompoundIndexes;
