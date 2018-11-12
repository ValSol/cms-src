import React from 'react';

import { appName, getThingConfig, thingNames } from '../../appConfig';
import { getNearestPath, getPathForRoute, makePathsList } from '../routesUtils';
import Layout2 from '../../components/Layout2';
import NotFound from './components/NotFound';

export default {
  path: '(.*)',

  action(context) {
    const { locale, pathname } = context;

    // определяем thingName исходя из текущего baseUrl и наиболее ...
    // ... близко расположенного пути для роута
    // находим все возможные адраса роутов для поиска
    const paths = thingNames.reduce((prev, name) => {
      const name2 = name.toLowerCase();
      // проверяем иммется ли в дереве роутов роут: `${thingName2}SearchRoute`
      const routeName = `${name2}SearchRoute`;
      const searchRoutePaths = makePathsList({ routeName });
      if (searchRoutePaths.length) {
        // если такой роут имеется - добавляем к списку возможных роутов
        prev.push(getPathForRoute(pathname, `${name2}SearchRoute`));
      }
      prev.push(getPathForRoute(pathname, `${name2}SearchFormsRoute`));
      return prev;
    }, []);
    // определяем самый подходящий адрес поиска
    const searchPath = getNearestPath(pathname, paths);
    // определяем индекс избранного адреса в общем списке адресов
    const index = paths.indexOf(searchPath);
    // и окончательно определяем подходящую thingName
    const thingName = thingNames[(index - index % 2) / 2];

    // определяем какой набор sideNavSections использотвать
    // тот что администрирования или тот что для контента
    const thingConfig = getThingConfig(thingName);
    const {
      sideNavSections: sideNavSectionsForAdmin,
      sideNavSectionsForContent,
    } = thingConfig;
    // т.е. определяем какому из роутов соответствует index
    // `${name2}SearchFormsRoute` или `${name2}SearchRoute`
    const sideNavSections =
      index % 2 ? sideNavSectionsForAdmin : sideNavSectionsForContent;

    return {
      pathname,
      title: appName,
      component: (
        <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
          <NotFound key={locale} />
        </Layout2>
      ),
      status: 404,
    };
  },
};
