/* eslint-disable no-underscore-dangle */
import { signout as signoutAction } from '../../../actions/auth';
import { redirectToHome } from '../../routesUtils';
import { getCookie, goToAbsolutePath } from '../../../core/utils';
import mutation from './signOut.graphql';

const signOut = async context => {
  const { client, store: { dispatch } } = context;
  const nextPath = process.env.BROWSER ? getCookie('next_path') : '';
  try {
    const { data } = await client.mutate({ mutation });
    if (data && data.signout && data.signout.email) {
      // обновляем в redux информацию о пользователе и путь для следующего перехода
      if (process.env.BROWSER) {
        dispatch(signoutAction({ nextPath }));
        // сбрасываем кеш Apollo
        await client.resetStore();
        goToAbsolutePath(nextPath, true);
      }
      return redirectToHome(context);
    }
    if (process.env.BROWSER) {
      goToAbsolutePath(nextPath, true);
    }
    return redirectToHome(context);
  } catch (err) {
    if (process.env.BROWSER) {
      goToAbsolutePath(nextPath, true);
    }
    return redirectToHome(context);
  }
};

export default signOut;
