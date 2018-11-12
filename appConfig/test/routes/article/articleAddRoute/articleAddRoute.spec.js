/* eslint-env jest */
import Promise from 'bluebird';

import { messagesForLocale } from '../../../../../core/utils';
import thingAddRoute from '../../../../../routes/thing/composeThingAddRoute/thingAddRoute';

describe('articleAddRoute route', () => {
  const article = {
    _id: '59ea1b33a3029e0f44c5ed40',
    title: {
      uk: 'abc - дуже довга назва',
    },
    shortTitle: {
      uk: 'abc - коротка назва',
    },
    content: {
      uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
    },
    backLinks: [],
  };
  test('should return route with correct attrs', async () => {
    // формируем моки ...
    // ...  graphql-запроса для получения article
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));

    const context = {
      baseUrl: '/admin/articles',
      client: { query },
      intl: { messages: messagesForLocale('uk') },
      locale: 'uk',
      params: {
        slug: '',
      },
      query: {},
    };
    const result = await thingAddRoute('Article', context);

    expect(result.title).toBe('Нова публікація');
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });
});
