import { getAbsolutePath } from '../../core/utils';

import getNearestPath from './getNearestPath';
import makePathsList from './makePathsList';
// функция getPathForRoute выбирает наиболее похожий путь
// из списка путей
// baseUrl - путь для которого ищется наиболее близкий путь из списка
// pathsList - путь из списка

const getPathForRoute = (baseUrl, routeName) => {
  const args = { routeName: routeName || '' };
  const pathsList = makePathsList(args);
  // если список путей - пуст - возбуждаем ошибку
  if (!pathsList.length) throw new TypeError('Empty paths list!');
  const absoluteBaseUrl = getAbsolutePath(baseUrl);
  return getNearestPath(absoluteBaseUrl, pathsList);
};

export default getPathForRoute;
