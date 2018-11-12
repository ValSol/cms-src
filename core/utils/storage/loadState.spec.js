/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import loadState from './loadState';

describe('localStorage utils', () => {
  beforeEach(() => {
    // будем использовать мок localStorage
    global.localStorage = new LocalStorage('localStorage.tmp');
    global.window.localStorage = localStorage;
  });
  afterEach(() => {
    global.localStorage = undefined;
    global.window.localStorage = undefined;
  });
  describe('loadState', () => {
    test('should get state from the localStorage', () => {
      const user = { email: 'example@example.com', role: 'admin' };
      const itemName = 'testUser2';
      const serializedState = JSON.stringify(user);
      localStorage.setItem(itemName, serializedState);
      const result = loadState(itemName);
      expect(result).toEqual(user);
      localStorage.removeItem(itemName);
    });
  });
});
