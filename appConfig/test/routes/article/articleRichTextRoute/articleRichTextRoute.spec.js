/* eslint-env jest */
import Promise from 'bluebird';

import { messagesForLocale } from '../../../../../core/utils';
import thingRichTextRoute from '../../../../../routes/thing/composeThingRichTextRoute/thingRichTextRoute';

describe('thingRichTextRoute route', () => {
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
      baseUrl: '/admin/articles/content',
      client: { query },
      intl: { messages: messagesForLocale('uk') },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      pathname: '/admin/articles/content',
      locale: 'uk',
      store: { dispatch: () => {} },
    };
    const result = await thingRichTextRoute('Article', context);

    expect(result.title).toEqual(
      `Редагування контента публікації: ${article.title.uk}`,
    );
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });

  test('should return null if article = null', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article: null } }));

    const context = {
      baseUrl: '/admin/articles/content',
      client: { query },
      intl: { messages: messagesForLocale('uk') },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      pathname: '/admin/articles/content',
      locale: 'uk',
    };

    const result = await thingRichTextRoute('Article', context);
    expect(result).toBeNull();
  });
});
