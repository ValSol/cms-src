import rbac from '../../../core/rbac';

import { saveNextPathAndRedirect } from '../../routesUtils';

// этот функция = обертка(прокладка) необходимая для проверки прав досутпа
// и корректности слага (slug), и при условии корректности ...
// ... для ЗАГРУЗКИ основного КОДА роутера

const composeThingListRoute = thingName => ({
  path: '/:slug?',

  async action(context, { slug }) {
    const { ping, store } = context;

    // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
    // обрабатываемый путь не соответствует
    if (ping) return null;

    const { auth: { user } } = store.getState();

    // если слага нет (что и требуется), НО нет прав доступа редирект (на домашнюю страницу)
    //  и сохранение в куках пути по которому не удалось зайти
    if (!slug && !rbac.can(`${thingName}:list`, { user })) {
      return saveNextPathAndRedirect(context);
    }

    let resultRoute = null;

    if (!slug) {
      const listThings = await require.ensure(
        [],
        require => require('./thingImportRoute').default,
        'admin',
      );
      resultRoute = await listThings(thingName, context);
    }
    return resultRoute;
  },
});

export default composeThingListRoute;
