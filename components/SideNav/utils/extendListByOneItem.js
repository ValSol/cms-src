import deepEqual from 'deep-equal';
// рекурсивная функция, добавляет в иерархический список дополнительный элемент
// в соответствующее с заданным шаблоном и параметрами добавляемого элемента
// prev - иерархическая структура в которую добавляется элемент
// item - добавляемый элемент (объект с определенным атрибутами)
// template - шаблон применяемой иерархии (массив объектов,
// в котором каждый объект задает очередной уровень иерархии и спользуемые
// на этом уровне атрибуты )
// path - путь применяемый в завершающем (листовом) сегменте иерархии
// currentPath - текущий путь - чтобы установить value='currentPath' по всей цепочке
// иерархии выбранного конечного (листогов) сегмента.
// level - текущий уровень обрабатываемой иерархии
// -------------------
const extendListByOneItem = (
  prev,
  item,
  template,
  path,
  currentPath,
  level = 0,
) => {
  // приводим значения атрибутов текущей секции исходя из значений задающих их параметров
  // передаваемых в item,
  // а именно, если значение атрибута начинается с двоеточия (":")
  // заменяем его значением получаемым из item, например если
  // { primaryText: ':subject'} и item.subject = 'patent',
  // то приведенное значение атрибута: { primaryText: 'patent'}
  const attrs = template[level];
  const reducedAttrs = Object.keys(attrs).reduce(
    (pre, key) => ({
      ...pre,
      [key]:
        attrs[key].charAt(0) === ':' ? item[attrs[key].slice(1)] : attrs[key],
    }),
    {},
  );

  // проверяем корректность атрибутов
  // возбуждаем ошибку если в шаблоне используется служебный атрибут nestedItems
  // т.к. "nestedItems" ВЫЧИСЛЯЕТСЯ чтобы указывать на дочерние listItems
  if (reducedAttrs.nestedItems) {
    throw new TypeError('Unacceptable attribute "nestedItems" in template!');
  }
  // возбуждаем ошибку если в шаблоне используется служебный атрибут nestedItems
  // т.к. value ВЫЧИСЛЯЕТСЯ иходя из значений "path" и "currentPath"
  if (reducedAttrs.value) {
    throw new TypeError('Unacceptable attribute "value" in template!');
  }
  // возбуждаем ошибку если в шаблоне ЛИСТОВОГО сегмента отствует
  // атрибует "primaryText"
  if (level === template.length - 1 && !reducedAttrs.primaryText) {
    throw new TypeError('required attribute "primaryText" is missing!');
  }

  if (level === template.length - 1) {
    // формируем заключительный сегмент ("лист") иерархии
    prev.push({ ...reducedAttrs, value: path });
    return prev;
  }
  // формируем следующий промежуточный сегмент иерархии
  // ищем был ли такой сегмент уже сформирован, сопоставляя значения всех полей
  // кроме nestedItems, которое исключаем из сравнения
  const segment = prev.find(({ nestedItems, value, ...rest }) =>
    deepEqual(reducedAttrs, rest),
  );
  if (segment && segment.nestedItems) {
    if (path === currentPath) segment.value = path;
    extendListByOneItem(
      segment.nestedItems,
      item,
      template,
      path,
      currentPath,
      level + 1,
    );
  } else {
    const newPrev = [];
    prev.push({
      ...reducedAttrs,
      value: path === currentPath ? path : undefined,
      nestedItems: extendListByOneItem(
        newPrev,
        item,
        template,
        path,
        currentPath,
        level + 1,
      ),
    });
  }
  return prev;
};

export default extendListByOneItem;
