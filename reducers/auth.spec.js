/* eslint-env jest */

import { SIGNIN_SUCCESS, SIGNOUT, SET_NEXTPATH, SET_USER } from '../constants';

import reducer from './auth';

describe('auth reducer', () => {
  test('should return the new auth state', () => {
    const newStore = reducer(undefined, {});
    expect(newStore).toEqual({ user: null, nextPath: null });
  });

  test('should set new auth state when signin', () => {
    const store = { user: null, nextPath: '/admin/articles/new' };
    const user = { email: 'example@example.com' };
    const action = {
      type: SIGNIN_SUCCESS,
      user,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ user, nextPath: null });
  });

  test('should set new auth state when signout', () => {
    const nextPath = '/admin/articles/new';
    const user = { email: 'example@example.com' };
    const store = {
      user,
      nextPath,
    };
    const action = {
      type: SIGNOUT,
      nextPath,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ user: null, nextPath });
  });

  test('should set new auth state for nextPath', () => {
    const nextPath = '/admin/articles/new';
    const user = { email: 'example@example.com' };
    const store = {
      user,
      nextPath: null,
    };
    const action = {
      type: SET_NEXTPATH,
      nextPath,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ user, nextPath });
  });

  describe('setUser for different users', () => {
    const nextPath = '/admin/articles/new';
    test('should set new auth state for new not null user', () => {
      const store = { user: null, nextPath };
      const user = { email: 'example@example.com', _id: '123' };
      const action = {
        type: SET_USER,
        user,
      };
      const newStore = reducer(store, action);
      expect(newStore).not.toBe(store);
      expect(newStore).toEqual({ user, nextPath });
    });
    test('should set new auth state for new not null user 2', () => {
      const store = {
        nextPath,
        user: { email: 'example2@example.com', _id: '987' },
      };
      const user = { email: 'example@example.com', _id: '123' };
      const action = {
        type: SET_USER,
        user,
      };
      const newStore = reducer(store, action);
      expect(newStore).not.toBe(store);
      expect(newStore).toEqual({ user, nextPath });
    });
    test('should set new auth state for new null', () => {
      const store = {
        nextPath,
        user: { email: 'example2@example.com', _id: '987' },
      };
      const user = null;
      const action = {
        type: SET_USER,
        user,
      };
      const newStore = reducer(store, action);
      expect(newStore).not.toBe(store);
      expect(newStore).toEqual({ user, nextPath });
    });
    test('should not set new auth state for same users', () => {
      const store = {
        nextPath,
        user: { email: 'example@example.com', _id: '123' },
      };
      const user = { email: 'example@example.com', _id: '123' };
      const action = {
        type: SET_USER,
        user,
      };
      const newStore = reducer(store, action);
      expect(newStore).toBe(store);
      expect(newStore).toEqual({ user, nextPath });
    });
    test('should not set new auth state for same null users', () => {
      const store = {
        nextPath,
        user: null,
      };
      const user = null;
      const action = {
        type: SET_USER,
        user,
      };
      const newStore = reducer(store, action);
      expect(newStore).toBe(store);
      expect(newStore).toEqual({ user, nextPath });
    });
  });
});
