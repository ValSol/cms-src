import queryString from 'query-string';

import { locales } from '../../../appConfig';
import history from '../../../history';
import getBreadcrumbs from '../path/getBreadcrumbs';
/*
  Переход по абсолютному адресу absolutePath ...
  ... если этот адрес не указан переходим в корень ...
  --- но в обоих случаях с учетом текущего языка
*/

const goToAbsolutePath = (absolutePath, mustReplace, query = {}) => {
  // начало
  let fragments = getBreadcrumbs(history.location.pathname);
  fragments = fragments.slice(0, locales.includes(fragments[0]) ? 1 : 0); // eslint-disable-line no-bitwise
  let absolutePathFragments = !absolutePath ? [] : getBreadcrumbs(absolutePath);
  absolutePathFragments = absolutePathFragments.slice(
    locales.includes(absolutePathFragments[0]) ? 1 : 0, // eslint-disable-line no-bitwise
  );

  const search = Object.keys(query).length
    ? `?${queryString.stringify(query)}`
    : '';

  const path = `/${[...fragments, ...absolutePathFragments].join(
    '/',
  )}${search}`;

  if (mustReplace) {
    history.replace(path);
  } else {
    history.push(path);
  }
};

export default goToAbsolutePath;
