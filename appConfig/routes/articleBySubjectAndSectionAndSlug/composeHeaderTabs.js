/* eslint-disable no-underscore-dangle */
import params from '../../params';
import {
  composePathAndSlug,
  composePathWithLocale,
  getAbsolutePath,
  sortItems,
} from '../../../core/utils';

const composeHeaderTabs = (populatedExcerpts, context) => {
  const { baseUrl, locale, params: { slug } } = context;
  const pathname = composePathAndSlug(baseUrl, slug);
  const absolutePathname = getAbsolutePath(pathname);
  // сортируем выборки в соотвтетствии порядком указанном в pathTree
  const sortedPopulatedExcerpts = sortItems(
    populatedExcerpts,
    [':subject', ':section'],
    params,
  );
  let currentFirstSegment = null;
  const headerTabs = [];

  sortedPopulatedExcerpts.forEach(({ subject, section, items }) => {
    // отфильтровываем пустые выборки
    // (пустые выборки могут возникнуть только в результате СБОЯ в базе данных)
    if (!items.length) return;
    // если обрабатываем excerpt с новым первым сегментом (subject)
    // добавляем информацию по очередному табу в массив табов (headerTabs)
    if (subject !== currentFirstSegment) {
      currentFirstSegment = subject;
      // вычисляем путь соответствующий табу в зависимости от тог
      // таб активный - то это текущий путь
      // не активный - первый из списка items путь
      const href =
        absolutePathname.indexOf(`/${subject}/`) === 0
          ? pathname
          : composePathWithLocale(
              composePathAndSlug(`/${subject}/${section}`, items[0].slug),
              locale,
            );

      headerTabs.push([subject, href]);
    }
  });
  return headerTabs;
};

export default composeHeaderTabs;
