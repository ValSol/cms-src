/* eslint-disable import/prefer-default-export */

import { SIGNIN_SUCCESS, SIGNOUT, SET_NEXTPATH, SET_USER } from '../constants';

export function signinSuccess({ user }) {
  return {
    type: SIGNIN_SUCCESS,
    user,
  };
}

export function signout({ nextPath }) {
  return {
    type: SIGNOUT,
    nextPath,
  };
}

export function setNextPath({ nextPath }) {
  return {
    type: SET_NEXTPATH,
    nextPath,
  };
}

export function setUser({ user }) {
  return {
    type: SET_USER,
    user,
  };
}
