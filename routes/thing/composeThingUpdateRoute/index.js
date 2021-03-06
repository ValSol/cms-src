import isMongoId from 'validator/lib/isMongoId';

import rbac from '../../../core/rbac';

import { saveNextPathAndRedirect } from '../../routesUtils';

// этот функция = обертка(прокладка) необходимая для проверки прав досутпа
// и корректности слага (slug), и при условии корректности ...
// ... для ЗАГРУЗКИ основного КОДА роутера

const composeThingUpdateRoute = thingName => ({
  path: '/:slug?',

  async action(context, { slug }) {
    const { store } = context;
    const { auth: { user } } = store.getState();

    // если слаг есть и он в формате MongoId (что и требуется),
    // НО нет прав доступа редирект (на домашнюю страницу)
    //  и сохранение в куках пути по которому не удалось зайти
    if (slug && isMongoId(slug) && !rbac.can(`${thingName}:update`, { user })) {
      return saveNextPathAndRedirect(context);
    }

    let resultRoute = null;

    if (slug && isMongoId(slug)) {
      const updateThing = await require.ensure(
        [],
        require => require('./thingUpdateRoute').default,
        'admin',
      );
      resultRoute = await updateThing(thingName, context);
    }
    return resultRoute;
  },
});

export default composeThingUpdateRoute;
