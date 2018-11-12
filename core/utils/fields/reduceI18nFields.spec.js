/* eslint-env jest */
import reduceI18nFields from './reduceI18nFields';

describe('reduceI18nFields', () => {
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
  };
  test('should reduce article object', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: 'Title',
      },
    };
    const result = reduceI18nFields(article, 'uk', thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: 'Назва',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should reduce incomplete article object', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        en: 'Title',
      },
    };
    const result = reduceI18nFields(article, 'uk', thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: 'Назва',
    };
    expect(result).toEqual(expectedResult);
  });
});
