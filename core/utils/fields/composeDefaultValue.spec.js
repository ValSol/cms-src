/* eslint-env jest */
import isString from '../is/isString';
import composeDefaultValue from './composeDefaultValue';

describe('composeDefaultValue', () => {
  const attributes = {
    booleanFields: [
      {
        name: 'show',
        default: true,
      },
      {
        name: 'firstPage',
        default: false,
      },
      {
        name: 'lastPage',
      },
    ],
    dateFields: [
      {
        name: 'viewedAt',
        default: new Date(2018, 0, 15, 2, 30),
      },
      {
        name: 'closedAt',
      },
    ],
    i18nFields: [
      {
        name: 'title',
      },
      {
        name: 'shortTitle',
      },
      {
        name: 'content',
      },
    ],
    numberFields: [
      {
        name: 'count',
        default: 333,
      },
      {
        name: 'stars',
      },
    ],
    paramFields: [
      {
        name: 'subject',
        default: ['patent'],
        multiple: true,
      },
      {
        name: 'section',
        multiple: false,
      },
      {
        name: 'genre',
        multiple: true,
      },
    ],
    textFields: [
      {
        name: 'phone1',
        default: '+380442331199',
      },
      {
        name: 'phone2',
      },
    ],
    specialFields: [
      {
        name: 'pictures',
        default: [{ src: '/abc', size: 200 }],
      },
      {
        name: 'slug',
        default: '',
      },
    ],
    subDocumentFields: [],
    richTextFields: ['content'],
    subDocumentName: 'Atributes',
  };
  const expectedResult = {
    title: { uk: '', ru: '', en: '' },
    shortTitle: { uk: '', ru: '', en: '' },
    content: { uk: '', ru: '', en: '' },
    show: true,
    firstPage: false,
    lastPage: false,
    viewedAt: new Date(2018, 0, 15, 2, 30),
    closedAt: undefined,
    count: 333,
    stars: undefined,
    subject: ['patent'],
    section: undefined,
    genre: [],
    phone1: '+380442331199',
    phone2: '',
    pictures: [{ src: '/abc', size: 200 }],
    slug: '',
  };
  test('should compose value without subDocumentFields', () => {
    const result = composeDefaultValue(attributes);
    // убеждаемся что добавлено id
    expect(isString(result.id)).toBe(true);
    delete result.id;
    // проверяем остальные поля в результате
    expect(result).toEqual(expectedResult);
  });
  test('should compose value with not array subDocumentFields', () => {
    const attributes3 = {
      i18nFields: [
        {
          name: 'title',
        },
      ],
      subDocumentFields: [
        {
          name: 'attributes',
          array: false,
          attributes,
        },
      ],
      subDocumentName: 'Atribute3',
    };
    const attributes2 = {
      i18nFields: [
        {
          name: 'title3',
        },
      ],
      subDocumentFields: [
        {
          name: 'attributes3',
          array: false,
          attributes: attributes3,
        },
        {
          name: 'attributesArray',
          array: true,
          attributes: attributes3,
        },
      ],
      subDocumentName: 'Attribute2',
    };
    const expectedResult2 = {
      title3: { uk: '', ru: '', en: '' },
      attributes3: {
        title: { uk: '', ru: '', en: '' },
        attributes: expectedResult,
      },
      attributesArray: [],
    };
    const result = composeDefaultValue(attributes2);
    // убеждаемся что добавлены id
    expect(isString(result.id)).toBe(true);
    delete result.id;
    expect(isString(result.attributes3.id)).toBe(true);
    delete result.attributes3.id;
    expect(isString(result.attributes3.attributes.id)).toBe(true);
    delete result.attributes3.attributes.id;
    // проверяем остальные поля в результате
    expect(result).toEqual(expectedResult2);
  });
  test('should compose value with not array subDocumentFields', () => {
    const attributes3 = {
      i18nFields: [
        {
          name: 'title',
        },
      ],
      subDocumentFields: [
        {
          name: 'attributes',
          array: false,
          attributes,
        },
      ],
      subDocumentName: 'Atribute3',
    };
    const attributes2 = {
      i18nFields: [
        {
          name: 'title3',
        },
      ],
      subDocumentFields: [
        {
          name: 'attributes3',
          array: false,
          attributes: attributes3,
        },
        {
          name: 'attributesArray',
          array: true,
          attributes: attributes3,
        },
      ],
      subDocumentName: 'Attribute2',
    };
    const paramsFromQuery = {
      subject: 'copyright',
      section: 'services',
    };
    const expectedResult2 = {
      title3: { uk: '', ru: '', en: '' },
      attributes3: {
        title: { uk: '', ru: '', en: '' },
        attributes: {
          ...expectedResult,
          subject: ['copyright'],
          section: 'services',
        },
      },
      attributesArray: [],
    };
    const result = composeDefaultValue(attributes2, paramsFromQuery);
    // убеждаемся что добавлены id
    expect(isString(result.id)).toBe(true);
    delete result.id;
    expect(isString(result.attributes3.id)).toBe(true);
    delete result.attributes3.id;
    expect(isString(result.attributes3.attributes.id)).toBe(true);
    delete result.attributes3.attributes.id;
    // проверяем остальные поля в результате
    expect(result).toEqual(expectedResult2);
  });
});
