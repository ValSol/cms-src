/* eslint-env jest */

import { SIGNIN_SUCCESS, SIGNOUT, SET_NEXTPATH, SET_USER } from '../constants';

import { signinSuccess, signout, setNextPath, setUser } from './auth';

describe('auth actions', () => {
  describe('signinSuccess', () => {
    test('should create an action to signin user', () => {
      const user = { email: 'v.solovyov@intellect.ua' };
      const expectedAction = {
        type: SIGNIN_SUCCESS,
        user,
      };
      expect(signinSuccess({ user })).toEqual(expectedAction);
    });
  });
  describe('signout', () => {
    test('should create an action to signout user', () => {
      const nextPath = '/en/admin/articles';
      const expectedAction = {
        type: SIGNOUT,
        nextPath,
      };
      expect(signout({ nextPath })).toEqual(expectedAction);
    });
  });
  describe('setNextPath', () => {
    test('should create an action to set nextPath', () => {
      const nextPath = '/en/admin/articles';
      const expectedAction = {
        type: SET_NEXTPATH,
        nextPath,
      };
      expect(setNextPath({ nextPath })).toEqual(expectedAction);
    });
  });
  describe('setUser', () => {
    test('should create an action to change user', () => {
      const user = { email: 'v.solovyov@intellect.ua' };
      const expectedAction = {
        type: SET_USER,
        user,
      };
      expect(setUser({ user })).toEqual(expectedAction);
    });
  });
});
