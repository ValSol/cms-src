import { locales } from '../../../appConfig';
import getBreadcrumbs from './getBreadcrumbs';

// функция возвращает адрес для соответствующий указанной локали
// path - путь для которого назначена локаль
// locale - количество звеньев адреса которые должны быть отброшены
const composePathAndSlug = (path, slug = '', locale = locales[0]) => {
  if (locales.indexOf(locale) === -1) {
    throw new TypeError(`locale="${locale}" don't use!`);
  }
  const pathBreadcrumbs = getBreadcrumbs(path);
  const slugBreadcrumbs = getBreadcrumbs(slug);
  const breadcrumbs =
    locale === locales[0]
      ? [...pathBreadcrumbs, ...slugBreadcrumbs]
      : [locale, ...pathBreadcrumbs, ...slugBreadcrumbs];
  return `/${breadcrumbs.join('/')}`;
};

export default composePathAndSlug;
