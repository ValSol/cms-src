/* eslint-env jest */
import Promise from 'bluebird';

import { messagesForLocale } from '../../../../../core/utils';
import thingListRoute from '../../../../../routes/thing/composeThingListRoute/thingListRoute';

describe('articleListRoute route', () => {
  const articles = [
    {
      _id: '5a3bc8b67b631c1188d547cf',
      subject: ['patent'],
      section: 'info',
      slug: '',
      createdAt: '2017-12-21T14:44:06.547Z',
      updatedAt: '2017-12-21T14:44:06.547Z',
      title: {
        uk: 'індексова сторінка - дуже довга назва',
        __typename: 'I18nStringsType',
      },
      __typename: 'ArticleType',
    },
    {
      _id: '5a3bc8b67b631c1188d547cc',
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      createdAt: '2017-12-21T14:44:06.546Z',
      updatedAt: '2017-12-21T14:44:06.546Z',
      title: {
        uk: 'abc - дуже довга назва',
        __typename: 'I18nStringsType',
      },
      __typename: 'ArticleType',
    },
    {
      _id: '5a3bc8b67b631c1188d547cd',
      subject: ['patent'],
      section: 'info',
      slug: 'xyz',
      createdAt: '2017-12-21T14:44:06.547Z',
      updatedAt: '2017-12-21T14:44:06.547Z',
      title: {
        uk: 'xyz - дуже довга назва (тестування пошуку)',
        __typename: 'I18nStringsType',
      },
      __typename: 'ArticleType',
    },
  ];
  test('should return route with correct attrs', async () => {
    // формируем мок graphql-запроса
    const query = jest.fn();
    query.mockReturnValueOnce(Promise.resolve({ data: { articles } }));

    const context = {
      baseUrl: '/admin/articles',
      client: { query },
      query: { sortedby: 'created' },
      intl: { messages: messagesForLocale('uk') },
      locale: 'uk',
      params: {
        slug: '',
      },
      pathname: '/admin/articles',
    };
    const result = await thingListRoute('Article', context);
    expect(result.title).toBe('Перелік публікацій');
    // убеждаемся что была создана компонента
    expect(result.component).toBeInstanceOf(Object);
  });
});
