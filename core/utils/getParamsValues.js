import filterObjectsByParams from './filterObjectsByParams';
import getMultipleParams from './fields/getMultipleParams';
// функция получает из списка элментов доступные значения параметров
// чтобы можно было отфильтровывать только по этим параметрам
// items - список объектов содержащих параметры
// paramsValues - перечень значений параметров нужный для ...
// ... упорядочивания выдаваемых списков значения параметров, и для ...
// ... получения результата БЕЗ обязательного перебора всех значений в items
// filters - фильтры применяемые к списку, с учетом которого определяются
// доступные значения параметров

const getParamsValues = (thingConfig, items, paramsValues, filters = {}) => {
  // создаем объект для сохранения результатов
  const result = Object.keys(paramsValues).reduce(
    (prev, paramName) => ({ ...prev, [paramName]: new Set() }),
    {},
  );
  // задаем справочник укзаывающий на множественные поля
  // например: { city: false, cuisine: true }
  const multipleParams = getMultipleParams(thingConfig);

  Object.keys(paramsValues).forEach(paramName => {
    // конструируем currentFilter для использования в утилите filteredItems
    const currentFilter = { ...filters };
    delete currentFilter[paramName];
    const filteredItems = filterObjectsByParams(
      thingConfig,
      items,
      currentFilter,
    );
    for (let i = 0; i < filteredItems.length; i += 1) {
      const item = filteredItems[i];
      if (multipleParams[paramName]) {
        // если значение параметра множественное проверяем каждое из значений
        item[paramName].forEach(item2 => {
          if (!paramsValues[paramName].includes(item2)) {
            throw new TypeError(
              `Incorrect value "${item[paramName]}" of param "${paramName}"!`,
            );
          }
        });
      } else if (!paramsValues[paramName].includes(item[paramName])) {
        // если значение параметра одинаррное одно значение значений
        throw new TypeError(
          `Incorrect value "${item[paramName]}" of param "${paramName}"!`,
        );
      }
      if (paramsValues[paramName].length > result[paramName].size) {
        if (multipleParams[paramName]) {
          item[paramName].forEach(item2 => result[paramName].add(item2));
        } else {
          result[paramName].add(item[paramName]);
        }
      } else {
        // если уже все возможные значения параметра присутствуют
        // выходим из цикла
        break;
      }
    }
  });

  Object.keys(paramsValues).forEach(paramName => {
    // формируем УПОРЯДОЧЕННЫЙ массив по каждому параметру
    result[paramName] = [...paramsValues[paramName]].filter(paramValue =>
      result[paramName].has(paramValue),
    );
  });

  return result;
};

export default getParamsValues;
