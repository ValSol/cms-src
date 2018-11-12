import { redirectToHome } from '../../routesUtils';
import signUp from './signUp';

export default {
  path: '/:slug?',

  async action(context) {
    const { params: { slug }, ping, store } = context;

    // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
    // обрабатываемый путь не соответствует
    if (ping) return null;

    const { auth: { user } } = store.getState();

    if (slug) return null;

    if (user) return redirectToHome(context);

    return signUp(context);
  },
};
