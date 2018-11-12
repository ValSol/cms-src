// сохраняем текущего пользователя в localStorage

import { SIGNIN_SUCCESS, SIGNOUT } from '../../constants';

import { saveState } from '../../core/utils';

// const persistUser = store => next => action => {
const persistUser = () => next => action => {
  if (process.env.BROWSER) {
    if (action.type === SIGNIN_SUCCESS) {
      saveState('user', action.user);
    } else if (action.type === SIGNOUT) {
      saveState('user', null);
    }
  }
  const result = next(action);
  return result;
};

export default persistUser;
