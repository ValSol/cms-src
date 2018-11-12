/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import saveState from './saveState';

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
  describe('saveState', () => {
    test('should save state in the localStorage', () => {
      const user = { email: 'example@example.com', role: 'admin' };
      const itemName = 'testUser1';
      saveState(itemName, user);
      const result = JSON.parse(localStorage.getItem(itemName));
      expect(result).toEqual(user);
      localStorage.removeItem(itemName);
    });
  });
});
