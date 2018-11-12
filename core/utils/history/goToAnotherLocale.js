import { locales } from '../../../appConfig';
import history from '../../../history';
import getBreadcrumbs from '../path/getBreadcrumbs';
/*
  Переход на тот же адрес, c теми же параметрами (если указан search)
  но со сменой локали
*/

const goToAnotherLocale = newLocale => {
  const { location: { pathname, search } } = history;
  // начало
  let fragments = getBreadcrumbs(pathname);
  // отбрасываем 0-й фрагмент (с локалью), если он есть
  fragments = fragments.slice(locales.includes(fragments[0]) ? 1 : 0); // eslint-disable-line no-bitwise
  // добавлеяем новую локаль, если это не локаль по умолчанию
  if (newLocale !== locales[0]) fragments.unshift(newLocale);
  history.push(`/${fragments.join('/')}${search}`);
};

export default goToAnotherLocale;
