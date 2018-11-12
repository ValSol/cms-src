/* eslint-disable no-underscore-dangle, no-throw-literal, import/prefer-default-export */

import { goToAbsolutePath } from '../../core/utils';
import { signinSuccess } from '../../actions/auth';

// ----------------------------------------------------------------------
// утилита для выполнения действий на клиенте после аутентификацц
// user - полльзователь полученный с сервера
// dispatch - диспетчер редукс стора
// props - пропсы компоненты

export const redirectAfterSignin = (user, dispatch, { auth }) => {
  // убираем куки с путем для перехода
  document.cookie = 'next_path=;path=/;max-age=-1';
  dispatch(signinSuccess({ user }));
  // переходим к редактированию не оставляя адрес формы регистрации ...
  // ... в истории браузера
  goToAbsolutePath(auth.nextPath, true);
};
