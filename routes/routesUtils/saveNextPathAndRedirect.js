import queryString from 'query-string';

import { locales } from '../../appConfig';
import { getBreadcrumbs } from '../../core/utils';
import { setNextPath } from '../../actions/auth';

// функция обеспечивает редирект если роут оказывается защищенным
// а пользователь не имеет прав на его просмотр, при этом сохраняется
// на который будет редирект после логина
const saveNextPathAndRedirect = context => {
  const { baseUrl, query, path, store } = context;
  let breadcrumbs = getBreadcrumbs(`${baseUrl}/${path}`);
  const search = Object.keys(query).length
    ? `?${queryString.stringify(query)}`
    : '';
  const nextPath = `/${breadcrumbs.join('/')}${search}`;

  store.dispatch(setNextPath({ nextPath }));

  // eslint-disable-next-line no-bitwise
  breadcrumbs = breadcrumbs.slice(0, locales.includes(breadcrumbs[0]) ? 1 : 0);
  breadcrumbs.push('signin');
  const redirectPath = `/${breadcrumbs.join('/')}`;

  if (process.env.BROWSER) return { redirect: redirectPath };

  // если обработка на сервере информация о nextPath возвращаем
  // чтобы затем установить куки с адресом следующего пути
  return { nextPath, redirect: redirectPath };
};

export default saveNextPathAndRedirect;
