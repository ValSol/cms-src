import isMongoId from 'validator/lib/isMongoId';

import { getThingConfig } from '../../../appConfig';
import rbac from '../../../core/rbac';

import {
  getNearestPath,
  getPathForRoute,
  saveNextPathAndRedirect,
} from '../../routesUtils';

// этот функция = обертка(прокладка) необходимая для проверки прав досутпа
// и корректности слага (slug), и при условии корректности ...
// ... для ЗАГРУЗКИ основного КОДА роутера

const composeThingPreviewRoute = thingName => ({
  path: '/:slug?/:field?',

  async action(context, { slug, field }) {
    const { richTextFields } = getThingConfig(thingName);
    const { baseUrl, pathname, ping, store } = context;
    const { auth: { user } } = store.getState();

    // опредяляем для какого из 4-х роутов, например: articleDeleteRoute, articleRecoverRoute
    // articleRichTextRoute, articleUpdateRoute - выполняется в настящее время
    // данный роут
    const deletePath = getPathForRoute(
      baseUrl,
      `${thingName.toLowerCase()}DeleteRoute`,
    );
    const recoverPath = getPathForRoute(
      baseUrl,
      `${thingName.toLowerCase()}RecoverRoute`,
    );
    const richTextPath = getPathForRoute(
      baseUrl,
      `${thingName.toLowerCase()}RichTextRoute`,
    );
    const updatePath = getPathForRoute(
      baseUrl,
      `${thingName.toLowerCase()}UpdateRoute`,
    );

    const paths = [deletePath, recoverPath, updatePath, richTextPath];
    // используем "волшебную" утилиту для выбора ближайшего (наиболее похожего) пути
    const nearestPath = getNearestPath(baseUrl, paths);

    let resultRoute = null;
    const href1 = pathname;
    // для каждого из 4 варинатов работы с thing в котором применяется preview
    if (nearestPath === deletePath && slug && isMongoId(slug) && !field) {
      // 1) удаление thing
      // проверяем права досута
      if (!rbac.can(`${thingName}:delete`, { user })) {
        return saveNextPathAndRedirect(context);
      }
      // и если все в порядке подгружаем КОД нужного роута
      const previewThing = await require.ensure(
        [],
        require => require('./thingPreviewRoute').default,
        'admin',
      );
      const href0 = `${deletePath}/${slug}`;
      const headerTabs = [
        ['Deleting', href0, `${thingName}:delete`],
        ['Preview', href1],
      ];
      resultRoute = await previewThing(thingName, headerTabs, context);
    } else if (nearestPath === recoverPath && !slug && !field) {
      // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
      // обрабатываемый путь не соответствует
      if (ping) return null;

      // 2) восстановление thing
      // проверяем права досута
      if (!rbac.can(`${thingName}:recover`, { user })) {
        return saveNextPathAndRedirect(context);
      }
      // и если все в порядке подгружаем КОД нужного роута
      const previewThing = await require.ensure(
        [],
        require => require('./thingPreviewFromLocalStorageRoute').default,
        'admin',
      );
      const href0 = recoverPath;
      const headerTabs = [
        ['Recovering', href0, `${thingName}:recover`],
        ['Preview', href1],
      ];
      resultRoute = await previewThing(thingName, headerTabs, context);
    } else if (
      nearestPath === richTextPath &&
      slug &&
      isMongoId(slug) &&
      field &&
      richTextFields.includes(field)
    ) {
      // 3) изменение richText-поля
      // проверяем права досута
      if (!rbac.can(`${thingName}:update`, { user })) {
        return saveNextPathAndRedirect(context);
      }
      // и если все в порядке подгружаем КОД нужного роута
      const previewThing = await require.ensure(
        [],
        require => require('./thingPreviewRoute').default,
        'admin',
      );
      const href0 = `${richTextPath}/${slug}/${field}`;
      const headerTabs = [
        ['Editing', href0, `${thingName}:update`],
        ['Preview', href1],
      ];
      resultRoute = await previewThing(thingName, headerTabs, context);
    } else if (
      nearestPath === updatePath &&
      slug &&
      !field &&
      isMongoId(slug)
    ) {
      // 4) изменение thing
      // проверяем права досута
      if (!rbac.can(`${thingName}:update`, { user })) {
        return saveNextPathAndRedirect(context);
      }
      // и если все в порядке подгружаем КОД нужного роута
      const previewThing = await require.ensure(
        [],
        require => require('./thingPreviewRoute').default,
        'admin',
      );
      const href0 = `${updatePath}/${slug}`;

      const headerTabs = [
        ['Editing', href0, `${thingName}:update`],
        ['Preview', href1],
      ];
      resultRoute = await previewThing(thingName, headerTabs, context);
    }
    return resultRoute;
  },
});

export default composeThingPreviewRoute;
