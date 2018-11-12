import { SIGNIN_SUCCESS, SIGNOUT, SET_NEXTPATH, SET_USER } from '../constants';

const initialState = {
  user: null,
  nextPath: null,
};

export default (state = initialState, action) => {
  const { type, user, nextPath } = action;
  switch (type) {
    case SIGNIN_SUCCESS:
      return { ...state, user, nextPath: null };
    case SIGNOUT:
      if (state.user === null) return state;
      return { ...state, nextPath, user: null };
    case SET_NEXTPATH:
      if (state.nextPath === nextPath) return state;
      return { ...state, nextPath };
    case SET_USER:
      if (
        (state.user && user && state.user._id === user._id) || // eslint-disable-line no-underscore-dangle
        (state.user === null && user === null)
      ) {
        return state;
      }
      return { ...state, user };
    default:
      return state;
  }
};
