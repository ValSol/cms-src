/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import {
  messagesForLocale,
  saveState, // для заполнения мока localstorage
} from '../../../../../core/utils';
import thingRecoverRoute from '../../../../../routes/thing/composeThingRecoverRoute/thingRecoverRoute';

describe('thingRecoverRoute route', () => {
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
      baseUrl: '/admin/articles/deleted',
      client: {},
      intl: { messages: messagesForLocale('uk') },
      params: { slug: '' },
      pathname: '/admin/articles/deleted',
      locale: 'uk',
    };

    const result = await thingRecoverRoute('Article', context);

    expect(result.title).toEqual(`Відновлення публікації: ${data.title.uk}`);
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });
});
