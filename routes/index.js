/* eslint-disable global-require */
import { pathTree, locales, thingNames } from '../appConfig';
import customRoutes from '../appConfig/routes';
import { unfoldPathTree, redirect } from './routesUtils';

import {
  composeThingAddRoute,
  composeThingBackLinksRoute,
  composeThingDBStatusRoute,
  composeThingDeleteRoute,
  composeThingExportRoute,
  composeThingImportRoute,
  composeThingListRoute,
  composeThingPreviewRoute,
  composeThingRecoverRoute,
  composeThingRichTextRoute,
  composeThingSearchRoute,
  composeThingSearchFormsRoute,
  composeThingUpdateRoute,
} from './thing';

import signIn from './user/signIn';
import signUp from './user/signUp';
import signOut from './user/signOut';
import notFound from './notFound';
import noJs from './noJs';

// создаем полный набор стандартных роутов для каждого из thingName
const thingRoutes = thingNames.reduce((prev, thingName) => {
  const thingName2 = thingName.toLowerCase();
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}AddRoute`] = composeThingAddRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}BackLinksRoute`] = composeThingBackLinksRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}DBStatusRoute`] = composeThingDBStatusRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}DeleteRoute`] = composeThingDeleteRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}ExportRoute`] = composeThingExportRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}ImportRoute`] = composeThingImportRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}ListRoute`] = composeThingListRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}PreviewRoute`] = composeThingPreviewRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}RecoverRoute`] = composeThingRecoverRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}RichTextRoute`] = composeThingRichTextRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}UpdateRoute`] = composeThingUpdateRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}SearchRoute`] = composeThingSearchRoute(thingName);
  // eslint-disable-next-line no-param-reassign
  prev[`${thingName2}SearchFormsRoute`] = composeThingSearchFormsRoute(
    thingName,
  );
  return prev;
}, {});

// вычисляем роут используемый по умолчанию (например) - это ДОЛЖЕН быть
// роут под названием ПЕРВОГО thing из списка thingNames в НИЖНЕМ регистре
// наприме, это 'article' если имя первого thing это 'Article'
const defaultRoute = customRoutes[thingNames[0].toLowerCase()];
// получаем домашний роут для ОСОБОГО использования
const { home2, ...rest } = customRoutes;
// заполняем объект содержащий роуты используемые при построении
// основного дерева путей, вычисляемого с помощью unfoldPathTree
const routes = {
  ...thingRoutes,
  noJs,
  signIn,
  signUp,
  signOut,
  ...rest,
};

// преобразуем базовые пути соответствуюющие языку
// из ['uk', 'en', 'ru'] в -> ['en', 'ru', '']
const firstLevel = [...locales.slice(1), ''];

// включаем в иерархию путей выбор языка
const tree = firstLevel.map(path => ({
  // action,
  path: path && `/${path}`,
  children: [home2, ...unfoldPathTree(pathTree, defaultRoute, routes)],
}));

// The top-level (parent) route
export default [
  ...redirect([['/uk', '']]),
  ...redirect([['/ua', '']]),
  ...tree,
  // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
  notFound,
];
