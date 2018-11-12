import isArray from './is/isArray';
import getMultipleParams from './fields/getMultipleParams';
// функция получает thingConfig и thing и формирует ...
// ... поля для соответствующих thing excerpt'ов

// вспомогательная функция рекурсивно перебирающая все поля из очередного сета
// очень похожая, практически такая же вспомогательн функция ...
// ... composeValuesForSet используемой в утилите: composeThingGqlVariablesByCompoundIndexes
const processPararmNameSet = (set, thing, multipleParams, results = []) => {
  const set2 = [...set]; // клонируем set

  // если первый вход в функцию для затравки добавляем в пустой массив
  // results свойство "paramNames"
  if (!results.length) {
    results.push({ paramNames: JSON.stringify(set.slice().sort()) });
  }
  // если перебраны все члены set возвращаем results;
  if (!set2.length) return results;
  // в противном случае отрабатываем первый из оставшихся элементов
  const paramName = set2[0];

  let results2;

  if (multipleParams[paramName]) {
    // если значение - параметра - НЕ массив - ошибка
    if (!isArray(thing[paramName])) {
      throw new TypeError(
        `The value of multiple param "${paramName}" has to be array!`,
      );
    }
    // массив НЕ заполнен - ошибка
    if (!thing[paramName].length) {
      throw new TypeError(`Array of params "${paramName}" has no items!`);
    }
    results2 = thing[paramName].reduce((prev, paramValue) => {
      // значение не определено - ошибка!
      if (paramValue === undefined) {
        throw new TypeError(`Undefined required "${paramName}" param value!`);
      }
      // получаем для каждого значения paramValue массив объектов: results3...
      const results3 = results.map(item => ({
        ...item,
        [paramName]: paramValue,
      }));
      // ... и помещаем его в итоговый массив
      prev.push(...results3);
      return prev;
    }, []);
  } else {
    // значение не определено - ошибка!
    if (thing[paramName] === undefined) {
      throw new TypeError(`Undefined required "${paramName}" param value!`);
    }
    // если значение - параметра - скаляр
    results2 = results.map(item => ({
      ...item,
      [paramName]: thing[paramName],
    }));
  }

  // отбрасываем первый элемент сета ...
  set2.shift();
  // и переходим к отработке следующего элемента сета ...
  // ... с уже частично заполненным массивом результатов
  return processPararmNameSet(set2, thing, multipleParams, results2);
};

const composeExcerptFields = (thingConfig, thing) => {
  const { orderedSets } = thingConfig;
  const multipleParams = getMultipleParams(thingConfig);
  // перебираем все возможные множества параметров
  const results = orderedSets.reduce((prev, set) => {
    // получаем соовтетствующие массивы объектов
    const setResult = processPararmNameSet(set, thing, multipleParams);
    // и помещаем их в результирующий массив
    prev.push(...setResult);
    return prev;
  }, []);
  return results;
};

export default composeExcerptFields;
