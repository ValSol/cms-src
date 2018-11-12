// функция получает из propsFromComponent 1) массив с данными для фильтрации
// 2) параметры строки браузера - сохраненные
// данных в общем списке публикаций
import { filtersFromQuery, filterObjectsByParams } from '../../../core/utils';

const filterItems = (thingConfig, params, items, query = {}) => {
  // если данных для обработки нет возвращаем пустой массив
  if (!items.length) return [];

  const { paramFields } = thingConfig;

  // помещаем в filters только параметры которые используются для фильтрации
  // для которых используются корректные значения параметров
  // где в качестве ключей используем имена этих параметров
  // thingParams - структура таже что и params, только для подмножества
  // относящегося только к данной thing
  const thingParams = paramFields.reduce(
    (prev, { name }) => ({ ...prev, [name]: params[name] }),
    {},
  );
  // например получаем: filters = { subject: 'patent', section: 'info' }
  const filters = filtersFromQuery(query, thingParams);

  // возвращаем отфильтрованные itmes данной thing
  return filterObjectsByParams(thingConfig, items, filters);
};

export default filterItems;
