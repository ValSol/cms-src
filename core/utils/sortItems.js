import isNumber from './is/isNumber';
import sortItemsByParam from './sortItemsByParam';
// функция возвращает массив с элементам упорядоченнімив соответствии
//  в соответствии с  шаблоном сортировки
// items - массив элеменов предназначенных для упорядочивания
// sortTemplate - массив  имен параметров по которым прводтися сортирвка
// 1) если имя параметра начинается с двоеточия (:) используется список значений
// параметра из словаря params
// 2) если имя параметра начинается с минуса (-) сортировка производится по убыванию
// params - объект содержащий ссылки массивы со значениями параметров для сортировки

const sortItems = (items, sortTemplate, params) => {
  let sortedItems = items.slice();
  // если пустой массив выходим без дополнительных обработок
  if (!sortedItems.length) return sortedItems;
  // меняем порядок параметров сортировки на противоположный
  // чтобы перебирать параметры с права нелево
  const sortTemplate2 = sortTemplate.slice();
  sortTemplate2.reverse();
  sortTemplate2.forEach(key => {
    if (key.charAt(0) === '-') {
      // если сортируем по убыванию
      const keyForReverse = key.slice(1);
      if (keyForReverse.charAt(0) === ':') {
        // если сортируем по списку значений параметров
        const paramName = keyForReverse.slice(1);
        sortedItems = sortItemsByParam(
          sortedItems,
          paramName,
          params[paramName],
        );
        sortedItems.reverse();
      } else {
        sortedItems.sort((a, b) => {
          if (isNumber(a[keyForReverse])) {
            // если сортируем по числовым значениям
            return b[keyForReverse] - a[keyForReverse];
          }
          return b[keyForReverse].localeCompare(a[keyForReverse]);
        });
      }
    } else if (key.charAt(0) === ':') {
      // если сортируем по списку значений параметров
      const paramName = key.slice(1);
      sortedItems = sortItemsByParam(sortedItems, paramName, params[paramName]);
    } else {
      sortedItems.sort((a, b) => {
        if (isNumber(a[key])) {
          // если сортируем по числовым значениям
          return a[key] - b[key];
        }
        return a[key].localeCompare(b[key]);
      });
    }
  });
  return sortedItems;
};

export default sortItems;
