/* eslint-env jest */
import { getThingConfig } from '../../../appConfig';

import composeValidate from './composeValidate';

describe('composeValidate', () => {
  const contentUk = {
    entityMap: {},
    blocks: [{ text: 'Контент українською' }],
  };
  const contentRu = { entityMap: {}, blocks: [{ text: 'Контент по русски' }] };
  const contentEn = { entityMap: {}, blocks: [{ text: 'Content in English' }] };
  const commentAttributes = {
    i18nFields: [
      {
        name: 'content',
        required: true,
      },
    ],
    textFields: { name: 'author', required: true },
    subDocumentFields: [],
    orderOfTheFormFields: [
      { name: 'author', required: true, kind: 'textFields' },
    ],
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
    subDocumentFields: [],
    richTextFields: ['content'],
    orderOfTheFormFields: [
      { name: 'subject', required: true, kind: 'paramFields' },
      { name: 'section', required: true, kind: 'paramFields' },
      { name: 'slug', required: true, kind: 'specialFields' },
      { name: 'pictures', required: false, kind: 'specialFields' },
    ],
  };
  test('should validate values', () => {
    const values = {
      subject: ['patent'],
      section: 'info',
      slug: '',
      title: {
        uk: '',
        ru: 'Заголовок',
        en: 'Title',
      },
      content: {
        uk: contentUk,
        ru: '',
        en: contentEn,
      },
      pictures: [{ src: '/images/1.gif' }, { src: '/images/2.gif' }],
    };
    const result = composeValidate(thingConfig)(values);
    const expectedResult = {
      title: { uk: 'RequiredField' },
      shortTitle: {
        uk: 'RequiredField',
        ru: 'RequiredField',
        en: 'RequiredField',
      },
      content: { ru: 'RequiredField' },
      slug: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate values with subDocumentFields', () => {
    const thingConfig2 = {
      ...thingConfig,
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
      orderOfTheFormFields: [
        ...thingConfig.orderOfTheFormFields,
        {
          name: 'bestComment',
          array: false,
          kind: 'subDocumentFields',
        },
        {
          name: 'comments',
          required: false,
          array: false,
          kind: 'subDocumentFields',
        },
      ],
    };
    const values = {
      subject: ['patent'],
      section: 'info',
      slug: '',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: 'Title',
      },
      shortTitle: {
        uk: 'Коротка назва',
        ru: 'Короткий заголовок',
        en: '',
      },
      content: {
        uk: contentUk,
        ru: contentRu,
        en: '',
      },
      bestComment: {
        author: '',
        content: {
          uk: contentUk,
          ru: contentRu,
        },
      },
      comments: [
        {
          author: '',
          content: {
            uk: contentUk,
            en: contentEn,
          },
        },
      ],
    };
    const result = composeValidate(thingConfig2)(values);
    const expectedResult = {
      content: { en: 'RequiredField' },
      shortTitle: { en: 'RequiredField' },
      slug: 'RequiredField',
      bestComment: {
        author: 'RequiredField',
        content: { en: 'RequiredField' },
      },
      comments: {
        '0': { author: 'RequiredField', content: { ru: 'RequiredField' } },
      },
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate values for real thingConfig', () => {
    const thingConfig3 = getThingConfig('Article');
    const values = {
      subject: ['patent'],
      section: '',
      slug: '',
      title: {
        uk: 'Назва',
        ru: 'Заголовок',
        en: '',
      },
      shortTitle: {
        uk: 'Коротка назва',
        ru: 'Короткий заголовок',
        en: '',
      },
      content: {
        uk: '',
        ru: '',
        en: '',
      },
      pictures: [],
    };
    const result = composeValidate(thingConfig3)(values);
    const expectedResult = {
      content: {
        uk: 'RequiredField',
        ru: 'RequiredField',
        en: 'RequiredField',
      },
      section: 'RequiredField',
      shortTitle: { en: 'RequiredField' },
      title: { en: 'RequiredField' },
    };
    expect(result).toEqual(expectedResult);
  });
});
