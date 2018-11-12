/* eslint-env jest */
import unpackFields from './unpackFields';

describe('unpackFields util', () => {
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
  test('should unpuck article object', () => {
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
        uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
        ru: '{"entityMap":{},"blocks":[{"text":"Контент по русски"}]}',
        en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
      },
    };
    const result = unpackFields(article, thingConfig);
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
        uk: {
          entityMap: {},
          blocks: [{ text: 'Контент українською' }],
        },
        ru: { entityMap: {}, blocks: [{ text: 'Контент по русски' }] },
        en: { entityMap: {}, blocks: [{ text: 'Content in English' }] },
      },
    };
    expect(result).toEqual(expectedResult);
  });
  test('should unpuck article object without service keys in from i18n strings', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: 'Title',
        __typename: 'I18nStringsType',
      },
      content: {
        uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
        ru: '{"entityMap":{},"blocks":[{"text":"Контент по русски"}]}',
        en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
        __typename: 'I18nStringsType',
      },
      pictures: [
        {
          caption: {
            uk: 'топ укр',
            ru: 'топ рус',
            en: 'top eng',
            __typename: 'I18nStringsType',
          },
          engaged: [],
          width: 220,
          height: 257,
          size: 2824,
          src: '/images/599d8a9532524e5e88a27baa.SJlD5zouZ.gif',
          __typename: 'PictureType',
        },
      ],
      __typename: 'ArticleType',
    };

    const result = unpackFields(article, thingConfig);
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
        uk: {
          entityMap: {},
          blocks: [{ text: 'Контент українською' }],
        },
        ru: { entityMap: {}, blocks: [{ text: 'Контент по русски' }] },
        en: { entityMap: {}, blocks: [{ text: 'Content in English' }] },
      },
      pictures: [
        {
          caption: {
            uk: 'топ укр',
            ru: 'топ рус',
            en: 'top eng',
          },
          engaged: [],
          width: 220,
          height: 257,
          size: 2824,
          src: '/images/599d8a9532524e5e88a27baa.SJlD5zouZ.gif',
        },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should unpuck article object without some i18n subfields', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        en: 'Title',
        __typename: 'I18nStringsType',
      },
      content: {
        uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
        en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
        __typename: 'I18nStringsType',
      },
      bestComment: {
        author: 'Vasya',
        content: {
          uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
          en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
        },
        __typename: 'CommentType',
      },
      comments: [
        {
          author: 'Vasya',
          content: {
            uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
            en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
          },
          __typename: 'CommentType',
        },
      ],
      __typename: 'ArticleType',
    };
    const result = unpackFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        en: 'Title',
      },
      content: {
        uk: {
          entityMap: {},
          blocks: [{ text: 'Контент українською' }],
        },
        en: { entityMap: {}, blocks: [{ text: 'Content in English' }] },
      },
      bestComment: {
        author: 'Vasya',
        content: {
          uk: {
            entityMap: {},
            blocks: [{ text: 'Контент українською' }],
          },
          en: { entityMap: {}, blocks: [{ text: 'Content in English' }] },
        },
      },
      comments: [
        {
          author: 'Vasya',
          content: {
            uk: {
              entityMap: {},
              blocks: [{ text: 'Контент українською' }],
            },
            en: { entityMap: {}, blocks: [{ text: 'Content in English' }] },
          },
        },
      ],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should unpuck article object without richTextFields', () => {
    const article = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        en: 'Title',
        __typename: 'I18nStringsType',
      },
      __typename: 'ArticleType',
    };
    const result = unpackFields(article, thingConfig);
    const expectedResult = {
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
      title: {
        uk: 'Назва',
        en: 'Title',
      },
    };
    expect(result).toEqual(expectedResult);
  });
});
