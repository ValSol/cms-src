// функция возвращает массив с элементам упорядоченнімив соответствии
//  с порядком значений параметра сортировки
// items - упорядочваемый массив
// paramName - имя параметра по которому проводится сортировка
// paramValues - массив задающий порядок значений параметра сортировки

const sortItemsByParam = (items, paramName, paramValues) => {
  // если элементов нет сортировка не нужна
  if (!items.length) return [];
  // формируем словарь с порядковыми номерами значений параметра,
  // например, { 'понедельник': 0, 'вторник': 1, 'среда': 2, 'четверг': 3, ...}
  const paramKeys = paramValues.reduce(
    (prev, item, i) => ({ ...prev, [item]: i }),
    {},
  );
  // отдельно проверяем корректность массива с одинм элементом
  // (так как функция сортирвки для такого массива не вызывается)
  if (items.length === 1) {
    const [item] = items;
    if (item[paramName] === undefined) {
      throw new TypeError(
        `Undefined param "${paramName}". Sorting is not possible!`,
      );
    }
    if (paramKeys[item[paramName]] === undefined) {
      throw new TypeError(
        `Undefined param value "${item[paramName]}". Sorting is not possible!`,
      );
    }
  }
  // сортируем элементы
  const sortedItems = items.slice();
  sortedItems.sort((a, b) => {
    if (a[paramName] === undefined || b[paramName] === undefined) {
      throw new TypeError(
        `Undefined param "${paramName}". Sorting is not possible!`,
      );
    }
    if (paramKeys[a[paramName]] === undefined) {
      throw new TypeError(
        `Undefined param value "${a[paramName]}". Sorting is not possible!`,
      );
    }
    if (paramKeys[b[paramName]] === undefined) {
      throw new TypeError(
        `Undefined param value "${b[paramName]}". Sorting is not possible!`,
      );
    }
    return paramKeys[a[paramName]] - paramKeys[b[paramName]];
  });
  return sortedItems;
};

export default sortItemsByParam;
