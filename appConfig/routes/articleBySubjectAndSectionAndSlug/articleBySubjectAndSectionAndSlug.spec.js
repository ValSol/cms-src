/* eslint-env jest */
import Promise from 'bluebird';

import route from './index';

describe('composeHeaderTabs util of article route', () => {
  const populatedExcerpts = [
    {
      _id: '59ea1b34a3029e0f44c5ed49',
      subject: 'design',
      section: 'info',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed42',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка (design)',
          },
        },
      ],
    },
    {
      _id: '59ea1b34a3029e0f44c5ed47',
      subject: 'patent',
      section: 'info',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed43',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка',
          },
        },
        {
          _id: '59ea1b33a3029e0f44c5ed40',
          slug: 'abc',
          shortTitle: {
            uk: 'abc - коротко',
          },
        },
        {
          _id: '59ea1b33a3029e0f44c5ed41',
          slug: 'xyz',
          shortTitle: {
            uk: 'xyz - коротко',
          },
        },
      ],
    },
    {
      _id: '59ea1b34a3029e0f44c5ed48',
      subject: 'patent',
      section: 'services',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed44',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка - services',
          },
        },
      ],
    },
  ];
  const article = {
    _id: '59ea1b33a3029e0f44c5ed40',
    title: {
      uk: 'abc - дуже довга назва',
    },
    content: {
      uk: 'abc контент українською',
    },
  };

  test('should return route with correct attrs', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));
    query.mockReturnValueOnce(Promise.resolve({ data: { populatedExcerpts } }));

    const context = {
      baseUrl: '/patent/info',
      client: { query },
      locale: 'uk',
      params: {
        subject: 'patent',
        section: 'info',
        slug: 'abc',
      },
    };
    const result = await route.action(context);
    expect(result.title).toEqual(article.title.uk);
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });

  test('should return null if section undefined', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));
    query.mockReturnValueOnce(Promise.resolve({ data: { populatedExcerpts } }));

    const context = {
      baseUrl: '/patent/info',
      client: { query },
      locale: 'uk',
      params: {
        subject: 'patent',
        slug: 'abc',
      },
    };
    const result = await route.action(context);
    expect(result).toBeNull();
  });

  test('should return null if subject is undefined', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));
    query.mockReturnValueOnce(Promise.resolve({ data: { populatedExcerpts } }));

    const context = {
      baseUrl: '/patent/info',
      client: { query },
      locale: 'uk',
      params: {
        section: 'info',
        slug: 'abc',
      },
    };
    const result = await route.action(context);
    expect(result).toBeNull();
  });

  test('should return null if article is null', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article: null } }));
    query.mockReturnValueOnce(
      Promise.resolve({ data: { populatedExcerpts: null } }),
    );

    const context = {
      baseUrl: '/patent/info',
      client: { query },
      locale: 'uk',
      params: {
        subject: 'patent',
        section: 'info',
        slug: 'abc',
      },
    };
    const result = await route.action(context);
    expect(result).toBeNull();
  });

  test('should return null if populatedExcerpts is null', async () => {
    // формируем моки двух последовательных graphql-запросов
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { article } }));
    query.mockReturnValueOnce(
      Promise.resolve({ data: { populatedExcerpts: null } }),
    );

    const context = {
      baseUrl: '/patent/info',
      client: { query },
      locale: 'uk',
      params: {
        subject: 'patent',
        section: 'info',
        slug: 'abc',
      },
    };
    const result = await route.action(context);
    expect(result).toBeNull();
  });
});
