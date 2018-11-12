import parseCrudePath from './parseCrudePath';

const unfoldPathTree = (pathTreeString, article, routes) => {
  // параметры: pathTreeString - строка задающая весь путь
  // article - роут для листового узла используемый по умолчанию
  // routes - hash содеражащий роуты для листовых узлов
  // (специально указаываемый в скобочках в pathTreeString)
  // удалеяем кооментарии из строки
  const lines = pathTreeString.split('\n').map(line => line.split('//')[0]);
  let currentObject = {};
  let currentArray = [];
  const shifts = { 0: currentArray };
  const positionForInsert = { 0: 0 };
  let shift = 0;
  // готовим список кастомных роутов routesArray чтобы делать проверку препятствующую
  // монтируованию роута по умолчанию article на тот или иной кастомный роут
  const routesArray = Object.keys(routes).map(key => routes[key]);
  const tree = lines.reduce((result, line, index) => {
    // если пустая строка - пропускаем
    if (!line.trim()) return result;
    // если не первая строка будем сравнивать с предыдущей строкой
    if (index !== 0) {
      const prevLine = lines[index - 1];
      // отступов предыдущей строки
      const prevShift = prevLine.search(/\S|$/);
      // отступов текущей строки
      shift = line.search(/\S|$/);
      if (shift > prevShift) {
        if (!currentObject.children) {
          // если в текущем объекте еще не был создан массив для дочерних роутов
          // т.е. если в скобочках не были указаны кастомные роуты, задает
          // создаем свойство children содержащее массив в текущем объекте
          currentObject.children = [];
        }
        currentArray = currentObject.children;
        positionForInsert[shift] = 0;
        shifts[shift] = currentArray;
      } else if (shift < prevShift) {
        // в объектах на предыдущем уровне которые оказались "листом"
        // меняем свойства
        currentArray.map(obj => {
          // если obj.children не был установлен по данным указанным в скобках
          // тогда монтируем листовой роут по умолчанию article, НО только в том случае
          // если текующий obj НЕ ЯВЛЯЕТСЯ кастомным роутом из списка routesArray
          if (!obj.children && routesArray.indexOf(obj) === -1) {
            obj.children = [article]; // eslint-disable-line no-param-reassign
          }
          return obj;
        });
        // возвращаемся на уровень иерахии
        // соответствующий отступу
        currentArray = shifts[shift];
      }
    }
    const { path, routeNames } = parseCrudePath(line);
    // предыдущий вариант, когда action вставлялся в каждый сегмент роута по цепочке
    // currentObject = { action, path: `/${path}` };
    currentObject = { path: `/${path}` };
    // если в скобочках были указаны имена листовых роутов
    // подключаем их к текущему роуту
    if (routeNames.length) {
      currentObject.children = routeNames.map(name => routes[name]);
    }
    currentArray.splice(positionForInsert[shift], 0, currentObject);

    positionForInsert[shift] += 1;
    return result;
  }, currentArray);
  // отрабатываем последнюю пачку объектов - которые становятся листами
  currentArray.map(obj => {
    obj.children = obj.children || [article]; // eslint-disable-line no-param-reassign
    return obj;
  });
  return tree;
};

export default unfoldPathTree;
