import { locales } from '../../../appConfig';
import getBreadcrumbs from './getBreadcrumbs';
import isObject from '../is/isObject';

// функция возвращает локаль соответствующую указанному пути
// /some/address - local = 'uk', /en/some/address - local = 'en'
// arg это или путь из которого извлекается локаль или
// объект вида { baseUrl } из которого извлекается путь из которого, затем локаль
const getLocale = arg => {
  // параметром может быть как путь так
  const path = isObject(arg) && arg.baseUrl ? arg.baseUrl : arg;
  const fisrtChain = getBreadcrumbs(path)[0] || '';
  let result = locales[0];
  locales.forEach(locale => {
    if (locale === fisrtChain) result = locale;
  });
  return result;
};

export default getLocale;
