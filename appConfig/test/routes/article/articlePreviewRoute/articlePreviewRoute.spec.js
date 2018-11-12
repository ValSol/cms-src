/* eslint-env jest */
import Promise from 'bluebird';

import thingPreviewRoute from '../../../../../routes/thing/composeThingPreviewRoute/thingPreviewRoute';

describe('thingPreviewRoute route', () => {
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
      baseUrl: '/admin/article/preview',
      client: { query },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      pathname: '/admin/article/preview/59ea1b33a3029e0f44c5ed40',
      locale: 'uk',
    };
    const result = await thingPreviewRoute('Article', [['Editing']], context);

    expect(result.title).toEqual(article.title.uk);
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });

  test('should return null if article = null', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article: null } }));

    const context = {
      baseUrl: '/admin/article/preview',
      client: { query },
      params: {
        slug: '59ea1b33a3029e0f44c5ed40',
      },
      pathname: '/admin/article/preview/59ea1b33a3029e0f44c5ed40',
      locale: 'uk',
    };
    const result = await thingPreviewRoute('Article', [], context);
    expect(result).toBeNull();
  });
});
