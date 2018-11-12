/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import {
  saveState, // для заполнения мока localstorage
} from '../../../../../core/utils';
import thingPreviewFromLocalStorageRoute from '../../../../../routes/thing/composeThingPreviewRoute/thingPreviewFromLocalStorageRoute';

describe('thingPreviewFromLocalStorageRoute route', () => {
  beforeAll(() => {
    // будем использовать мок localStorage
    global.localStorage = new LocalStorage('localStorage.tmp');
    global.window.localStorage = localStorage;
    global.process.env.BROWSER = true;
  });
  afterAll(() => {
    global.localStorage = undefined;
    global.window.localStorage = undefined;
    global.process.env.BROWSER = undefined;
  });

  test('should return route with correct attrs', async () => {
    const data = {
      _id: '59ea1b33a3029e0f44c5ed40',
      title: { uk: 'abc - дуже довга назва' },
      content: {
        uk: {
          entityMap: {},
          blocks: [{ text: 'Контент українською' }],
        },
      },
    };
    // предварительно заполняем хранилище данными
    saveState('deletedArticle', data);

    const context = {
      baseUrl: '/admin/article',
      locale: 'uk',
      params: {
        slug: 'deleted',
      },
    };

    const result = await thingPreviewFromLocalStorageRoute(
      'Article',
      [],
      context,
    );

    expect(result.title).toEqual(data.title.uk);
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });
});
