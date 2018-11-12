import { locales } from '../../appConfig';
import { getBreadcrumbs } from '../../core/utils';

// функция обеспечивает редирект если роут не нужен защищенному пользователю
// по адресу
const redirectToHome = context => {
  const { baseUrl } = context;

  let breadcrumbs = getBreadcrumbs(baseUrl);

  // eslint-disable-next-line no-bitwise
  breadcrumbs = breadcrumbs.slice(0, locales.includes(breadcrumbs[0]) ? 1 : 0);

  const redirectPath = `/${breadcrumbs.join('/')}`;
  // если обработка на сервере информация о nextPath возвращаем
  // чтобы затем установить куки с адресом следующего пути
  return { redirect: redirectPath };
};

export default redirectToHome;
