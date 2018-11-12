import { redirectToHome } from '../../routesUtils';
import listThings from './thingSearchRoute';

// этот функция = обертка(прокладка) необходимая для проверки прав досутпа
// и корректности слага (slug), и при условии корректности ...
// ... для ЗАГРУЗКИ основного КОДА роутера

const composeThingListRoute = thingName => ({
  path: '/:slug?',

  async action(context, { slug }) {
    const { ping, query } = context;

    // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
    // обрабатываемый путь не соответствует
    if (ping) return null;

    let resultRoute = null;

    if (!slug) {
      // если не указана строка поиска переходим на домашнюю страницу
      if (!query.q) return redirectToHome(context);

      resultRoute = await listThings(thingName, context);
    }
    return resultRoute;
  },
});

export default composeThingListRoute;
