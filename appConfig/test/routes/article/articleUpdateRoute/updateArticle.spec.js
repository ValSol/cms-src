/* eslint-env jest */
import Promise from 'bluebird';

import { messagesForLocale } from '../../../../../core/utils';
import thingUpdateRoute from '../../../../../routes/thing/composeThingUpdateRoute/thingUpdateRoute';

describe('thingUpdateRoute route', () => {
  const article = {
    _id: '59ea1b33a3029e0f44c5ed40',
    title: {
      uk: 'abc - дуже довга назва',
    },
    content: {
      uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
    },
    backLinks: [],
  };

  test('should return route with correct attrs', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));

    const context = {
      baseUrl: '/admin/article',
      client: { query },
      intl: { messages: messagesForLocale('uk') },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      locale: 'uk',
    };
    const result = await thingUpdateRoute('Article', context);
    expect(result.title).toEqual(`Редагування публікації: ${article.title.uk}`);
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });

  test('should return null if article = null', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article: null } }));

    const context = {
      baseUrl: '/admin/article',
      client: { query },
      intl: { messages: messagesForLocale('uk') },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      locale: 'uk',
    };
    const result = await thingUpdateRoute('Article', context);
    expect(result).toBeNull();
  });
});
