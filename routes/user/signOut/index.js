import { redirectToHome } from '../../routesUtils';
import signOut from './signOut';

export default {
  path: '/:slug?',

  action(context) {
    const { params: { slug }, ping, store } = context;

    // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
    // обрабатываемый путь не соответствует
    if (ping) return null;

    const { auth: { user } } = store.getState();

    if (slug) return null;

    // не залогиненный пользователь не может разлогиниться
    if (!user) return redirectToHome(context);

    return signOut(context);
  },
};
