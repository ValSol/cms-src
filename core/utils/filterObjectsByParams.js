import getMultipleParams from './fields/getMultipleParams';
// функция фильтруем массив объектов по указанным фильтрам
// items - массив объектов
// filters - применяемые фильтры

const filterObjectsByParams = (thingConfig, items, filters = {}) => {
  // задаем справочник укзаывающий на множественные поля
  // например: { city: false, cuisine: true }
  const multipleParams = getMultipleParams(thingConfig);

  return items.filter(item =>
    Object.keys(filters).every(
      // отфильтровываем по совпадению значений
      paramName =>
        multipleParams
          ? item[paramName].includes(filters[paramName])
          : item[paramName] === filters[paramName],
    ),
  );
};

export default filterObjectsByParams;
