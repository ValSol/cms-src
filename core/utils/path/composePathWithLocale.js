import { locales } from '../../../appConfig';
import getAbsolutePath from './getAbsolutePath';
import getBreadcrumbs from './getBreadcrumbs';

// функция возвращает адрес для соответствующий указанной локали
// path - путь для которого назначена локаль
// locale - количество звеньев адреса которые должны быть отброшены
const composePathWithLocale = (path, locale) => {
  if (locales.indexOf(locale) === -1) {
    throw new TypeError(`locale="${locale}" don't use!`);
  }
  let breadcrumbs = getBreadcrumbs(getAbsolutePath(path));
  breadcrumbs = locale === locales[0] ? breadcrumbs : [locale, ...breadcrumbs];
  return `/${breadcrumbs.join('/')}`;
};

export default composePathWithLocale;
