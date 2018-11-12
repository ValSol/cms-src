import { params, pathTree } from '../../appConfig';
import expandPathArray from './expandPathArray';
import makePathsArrays from './makePathsArrays';

// библиотека используется для меморизации (кеширования)
// результата выполнения функции при данных входящих параметрах
const pathsList = {};

// функция возвращает список путей задаваемых строчным деревом пути
// из собранных массивов формирует пути
const makePathsList = (args = {}) => {
  const paramsObject = args.params || params;
  const pathTreeString = args.pathTreeString || pathTree;
  const routeName = args.routeName || '';
  // если такой набор путей уже вычислялся, берем из кеша, но возвращаем
  // в новом массиве - чтобы кеш не испортить дальнешими манипуляциями с массивом
  if (!args.pathTreeString && pathsList[routeName]) {
    return pathsList[routeName].slice();
  }
  const result = makePathsArrays(pathTreeString, routeName)
    .reduce(
      (prev, path) => prev.concat(expandPathArray(path, paramsObject)),
      [],
    )
    .map(list => `/${list.join('/')}`);
  // кешируем результат только если pathTreeString получен по УМОЛЧАНИЮ ...
  // ... ИЗ стандартного appConfig файла
  if (!args.pathTreeString) pathsList[routeName] = result;
  return result;
};

export default makePathsList;
