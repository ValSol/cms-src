import { params } from '../../../appConfig';
import { sortItems } from '../../../core/utils';
// функция получает из propsFromComponent
// thingConfig - соотвтествующий текущей thing
// items - массив с данными для сотритовки
// query - параметры строки браузера
// и возвращает отсортированне items

const sortThingListItems = (thingConfig, items, query) => {
  // если данных для обработки нет возвращаем пустой массив
  if (!items.length) return [];

  const { sortingOptions } = thingConfig;

  // выбираем или 1) значение из списка допустимых значений сортироваки
  // или 2) значение по умолчанию (из того же списка)
  const sortTemplate = sortingOptions.reduce(
    (prev, { default: isDefault, name, template }) => {
      // eslint-disable-next-line no-param-reassign
      if (name === query.sortedby) prev = template;
      // eslint-disable-next-line no-param-reassign
      if (isDefault && !prev) prev = template;
      return prev;
    },
    null,
  );

  // для случая сортировки по моменту создания или редактирования
  // нужно добавить в список соответствующий дополнительный атрибут
  let itemsForSort = items;
  if (sortTemplate.includes('created') || sortTemplate.includes('-created')) {
    itemsForSort = items.map(item => ({
      ...item,
      created: Date.parse(item.createdAt),
    }));
  } else if (
    sortTemplate.includes('updated') ||
    sortTemplate.includes('-updated')
  ) {
    itemsForSort = items.map(item => ({
      ...item,
      updated: Date.parse(item.updatedAt),
    }));
  }
  // возвращаем отсортирвоанные items;
  // params - используется только если в sortTemplate используются значения справочников
  return sortItems(itemsForSort, sortTemplate, params);
};

export default sortThingListItems;
