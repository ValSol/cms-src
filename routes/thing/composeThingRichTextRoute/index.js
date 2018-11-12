import isMongoId from 'validator/lib/isMongoId';

import { getThingConfig } from '../../../appConfig';
import rbac from '../../../core/rbac';

import { saveNextPathAndRedirect } from '../../routesUtils';

// этот функция = обертка(прокладка) необходимая для проверки прав досутпа
// и корректности слага (slug), и при условии корректности ...
// ... для ЗАГРУЗКИ основного КОДА роутера

const composeThingUpdateRoute = thingName => ({
  // параметр field используется для открытия формы работы с ОТДЕЛЬНЫМ полем
  // в настоящее время используем ТОЛЬКО для richtext полей
  path: '/:slug?/:field?',

  async action(context, { slug, field }) {
    const { store } = context;
    const { auth: { user } } = store.getState();

    const { richTextFields } = getThingConfig(thingName);

    // если слаг есть и он в формате MongoId (что и требуется),
    // НО нет прав доступа редирект (на домашнюю страницу)
    //  и сохранение в куках пути по которому не удалось зайти
    if (
      slug &&
      field &&
      richTextFields.includes(field) &&
      isMongoId(slug) &&
      !rbac.can(`${thingName}:update`, { user })
    ) {
      return saveNextPathAndRedirect(context);
    }

    let resultRoute = null;

    if (slug && field && richTextFields.includes(field) && isMongoId(slug)) {
      const richtextThing = await require.ensure(
        [],
        require => require('./thingRichTextRoute').default,
        'admin',
      );
      resultRoute = await richtextThing(thingName, context);
    }
    return resultRoute;
  },
});

export default composeThingUpdateRoute;
