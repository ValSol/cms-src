// функция исходя из параметров строки бразуера
// формирует фильтры
// для которых используются коректные значения параметров и
// где в качестве ключей используем имена этих параметров
// query - параметры в строке браузера
// params - объект содержащий массивы значений ...
// ... соответствующий используемым параметрам

const filtersFromQuery = (query, params) =>
  Object.keys(params).reduce((prev, paramName) => {
    // если параметр используется
    if (
      query[`filteredby${paramName}`] !== undefined &&
      // и его значение корректное
      params[paramName].includes(query[`filteredby${paramName}`])
    ) {
      // eslint-disable-next-line no-param-reassign
      prev[paramName] = query[`filteredby${paramName}`];
    }
    return prev;
  }, {});

export default filtersFromQuery;
