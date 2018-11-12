import { locales } from '../../../appConfig';
import getBreadcrumbs from './getBreadcrumbs';

// функция возвращает абсолютный адрес без локали
// отбросив backShift завершающих звеньев адреса
// path - путь из которого удаляется локаль
// backShift - количество звеньев адреса которые должны быть отброшены
const getAbsolutePath = (path, backShift) => {
  const breadcrumbs = getBreadcrumbs(path).slice(
    0,
    backShift ? -backShift : undefined,
  );
  if (locales.indexOf(breadcrumbs[0]) !== -1) breadcrumbs.splice(0, 1);
  return `/${breadcrumbs.join('/')}`;
};

export default getAbsolutePath;
