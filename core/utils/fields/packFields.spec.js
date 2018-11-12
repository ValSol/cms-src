/* eslint-env jest */
import packFields from './packFields';

describe('packFields', () => {
  const contentUk = {
    entityMap: {},
    blocks: [{ text: 'Контент українською' }],
  };
  const contentRu = { entityMap: {}, blocks: [{ text: 'Контент по русски' }] };
  const contentEn = { entityMap: {}, blocks: [{ text: 'Content in English' }] };
  const contentUkStringified = JSON.stringify(contentUk);
  const contentRuStringified = JSON.stringify(contentRu);
  const contentEnStringified = JSON.stringify(contentEn);
  const commentAttributes = {
    richTextFields: ['content'],
    subDocumentFields: [],
  };
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
    subDocumentFields: [
      {
        name: 'bestComment',
        array: false,
        attributes: commentAttributes,
      },
      {
        name: 'comments',
        array: true,
        attributes: commentAttributes,
      },
    ],
    richTextFields: ['content'],
  };
  test('should puck article object', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: 'Title',
      },
      content: {
        uk: contentUk,
        ru: contentRu,
        en: contentEn,
      },
      pictures: [{ src: '/images/1.gif' }, { src: '/images/2.gif' }],
    };
    const result = packFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: 'Title',
      },
      content: {
        uk: contentUkStringified,
        ru: contentRuStringified,
        en: contentEnStringified,
      },
      pictures: [{ src: '/images/1.gif' }, { src: '/images/2.gif' }],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should puck article object without some unpacked i18n keys', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
      },
      content: {
        uk: contentUk,
        ru: contentRu,
      },
    };
    const result = packFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
      },
      content: {
        uk: contentUkStringified,
        ru: contentRuStringified,
      },
    };
    expect(result).toEqual(expectedResult);
  });
  test('should puck article object without unpacked i18n keys', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
    };
    const result = packFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should puck article object with subDocumentFields', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
      },
      content: {
        uk: contentUk,
        ru: contentRu,
      },
      bestComment: {
        author: 'Vasya',
        content: {
          uk: contentUk,
          ru: contentRu,
        },
      },
      comments: [
        {
          author: 'Vasya',
          content: {
            uk: contentUk,
            ru: contentRu,
          },
        },
      ],
    };
    const result = packFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
      },
      content: {
        uk: contentUkStringified,
        ru: contentRuStringified,
      },
      bestComment: {
        author: 'Vasya',
        content: {
          uk: contentUkStringified,
          ru: contentRuStringified,
        },
      },
      comments: [
        {
          author: 'Vasya',
          content: {
            uk: contentUkStringified,
            ru: contentRuStringified,
          },
        },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
});
