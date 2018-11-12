import { getAbsolutePath } from '../../core/utils';

// функция getNearestPath выбирает наиболее похожий путь
// из списка путей
// baseUrl - путь для которого ищется наиболее близкий путь из списка
// pathsList - список путей

// вспомогательная функция для выбора ближашег пути
const nearestPath = (baseUrl, pathsList) => {
  // получаем цепочку сегментов формирующих baseUrl
  const baseUrlChain = baseUrl.split('/').filter(Boolean);

  // преобразуем pathsList в массив удобный для обработки, например
  // ['admin/articles', 'admin/articles/preview'] преобразуется в
  // [{ path: 'admin/articles', chain: ['admin', 'articles'] },
  // { path: 'admin/articles/preview'}, chain: ['admin', 'articles', 'preview']] в
  let pathsForProcessing = pathsList.map(item => ({
    path: item,
    chain: item.split('/').filter(Boolean),
  }));

  let resultPaths = pathsForProcessing;
  // вставляем заглушку на первую позицию baseUrlChain чтобы она была
  // выброшена на первом же цикле
  baseUrlChain.unshift('foo');
  while (baseUrlChain.length && pathsForProcessing.length) {
    baseUrlChain.shift();
    resultPaths = pathsForProcessing;
    // отфильтровываем только пути которые содержат текущий самый крайний сегмент
    // и у отфильтрованных путей отбрасываем уже проверенные сегмент
    pathsForProcessing = pathsForProcessing
      .filter(({ chain }) => chain[0] === baseUrlChain[0])
      // eslint-disable-next-line no-loop-func
      .map(({ chain, path }) => {
        chain.shift();
        return { chain, path };
      });
  }
  // в оставшихся отфильтрованных путях находим ПЕРВЫЙ путь в списке с наименьшим
  // количесвтом оставшихся (несовпавших) сегментов
  // то есть минимально отличающийся от первоначального
  let result = resultPaths[0];
  resultPaths.forEach(({ chain, path }) => {
    if (chain.length < result.chain.length) result = { chain, path };
  });

  // возвращаем собственно путь
  return result.path;
};

const getNearestPath = (baseUrl, pathsList) => {
  // если список путей - пуст - возбуждаем ошибку
  if (!pathsList.length) throw new TypeError('Empty paths list!');
  // если путь только один - выбираем его
  if (pathsList.length === 1) return pathsList[0];
  const absoluteBaseUrl = getAbsolutePath(baseUrl);
  // проверяем случай если pathsList содержит точное значение baseUrl
  const index = pathsList.indexOf(baseUrl);
  if (index !== -1) return pathsList[index];
  return nearestPath(absoluteBaseUrl, pathsList);
};

export default getNearestPath;
