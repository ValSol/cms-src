/*
* @jest-environment jsdom
*/
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import {
  saveState, // для заполнения мока localstorage
} from '../../../core/utils';
import getDeletedThing from './getDeletedThing';

describe('articleFromLocalStorage route', () => {
  const thingConfig = {
    i18nFields: [
      {
        name: 'title',
        required: true,
      },
      {
        name: 'shortTitle',
        required: true,
      },
      {
        name: 'content',
        required: true,
      },
    ],
    specialFields: [
      {
        // хранит уникальный идентификатор использующийся в адресной строке браузера
        name: 'slug',
        required: false,
        default: '', // для текстовых полей если required = false - указываеть по умолчанию
      },
      {
        // коллекция картинок
        name: 'pictures',
        required: false,
        default: [], // используем в thingAddRoute роуте и утилите getDeletedThing
      },
    ],
    thingName: 'Article',
  };
  test('should return article with correct attrs', () => {
    // будем использовать мок localStorage
    global.localStorage = new LocalStorage('localStorage.tmp');
    global.window.localStorage = localStorage;
    // ... содержащий информацию об deletedArticle
    // для этого заполняем хранилище данными
    const data = {
      _id: '59ea1b33a3029e0f44c5ed40',
      'title:uk': 'abc - дуже довга назва',
      'shortTitle:uk': 'abc - дуже довга назва',
      'content:uk': 'abc контент українською',
    };
    saveState('deletedArticle', data);

    const result = getDeletedThing(thingConfig);

    expect(result).toEqual(data);
    global.localStorage = undefined;
    global.window.localStorage = undefined;
  });
  test('should return null with empty localStorage', () => {
    // будем использовать мок localStorage...
    global.localStorage = new LocalStorage('localStorage.tmp');
    global.window.localStorage = localStorage;
    // ... не содержащий информацию об deletedArticle
    saveState('deletedArticle', '');

    const result = getDeletedThing(thingConfig);

    expect(result).toBeNull();
    global.localStorage = undefined;
    global.window.localStorage = undefined;
  });
  test('should return null if run on server', () => {
    const result = getDeletedThing(thingConfig);
    const expectedResult = null;
    expect(result).toEqual(expectedResult);
  });
});
