import parseCrudePath from './parseCrudePath';

// вспомогательная функция разбирающая строковую иерархиию путей
// на массив массивов
const makePathsArrays = (pathTreeString, routeName) => {
  // debugger;
  // функция возвращает список всех путей задаваемых деревом путей
  const lines = pathTreeString
    // удалеяем кооментарии из строки
    .split('\n')
    .map(line => line.split('//')[0])
    .filter(line => line.trim());
  let currentArray = [];
  const shifts = {}; // сдвиги соответствующие позиции в списке
  const arraysForRemove = new WeakSet();
  // для определения небыло ли на предыдущей строке кастомного роута
  let prevRouteNamesLength = 0;
  return lines
    .reduce(
      (result, line, index) => {
        // если пустая строка - пропускаем
        if (!line.trim()) return result;
        // отступов текущей строки
        const shift = line.search(/\S|$/);
        if (index === 0) {
          shifts[0] = shift;
        } else {
          // если не первая строка будем сравнивать с предыдущей строкой
          const prevLine = lines[index - 1];
          // отступов предыдущей строки
          const prevShift = prevLine.search(/\S|$/);

          // если имел место сдвиг вправо - обновляем словарь сдвигов
          // на еще более правый сдвиг
          if (shift > prevShift) shifts[shift] = shifts[prevShift] + 1;

          if (shift <= prevShift || prevRouteNamesLength) {
            // если остались на том же уровне или сдвинулись обратно - влево
            // или на предыдущей строке был кастомный роут
            // нужно создавать новый массив для формирования новой строки
            currentArray = [...currentArray.slice(0, shifts[shift])];
            result.push(currentArray);
          }
        }
        const { path, routeNames } = parseCrudePath(line);
        prevRouteNamesLength = routeNames.length;
        currentArray.push(path);
        // определяем массивы которые нужно будет выбросить из итогового массива
        if (routeName) {
          // если нужо отобрать строки соответствующие
          // только опеределенным листовому роуту с именем routeName
          // eslint-disable-next-line no-bitwise
          if (routeNames.includes(routeName)) {
            // если содержит указанный листовой роут
            arraysForRemove.delete(currentArray);
          } else {
            arraysForRemove.add(currentArray);
          }
        } else if (routeNames.length) {
          // если нужо отобрать строки с роутами по умолчанию
          // и для данной строки указан кастомный роут
          arraysForRemove.add(currentArray);
        }
        return result;
      },
      [currentArray],
    )
    .filter(list => !arraysForRemove.has(list));
};

export default makePathsArrays;
