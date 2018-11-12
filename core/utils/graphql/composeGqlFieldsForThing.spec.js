/* eslint-env jest */
import composeGqlFieldsForThing from './composeGqlFieldsForThing';

const pictureFields = {
  engaged: null,
  md5Hash: null,
  src: null,
  width: null,
  height: null,
  size: null,
  uploadedAt: null,
  initialName: null,
  caption: {
    uk: null,
    ru: null,
    en: null,
  },
};

describe('composeGqlFieldsForThing core util', () => {
  test('should return fields for Article thing', () => {
    const thingConfig = {
      booleanFields: [],
      dateFields: [],
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
      numberFields: [],
      paramFields: [
        {
          name: 'subject',
          multiple: false,
          required: true,
        },
        {
          name: 'section',
          multiple: false,
          required: true,
        },
      ],
      specialFields: [
        {
          // хранит уникальный идентификатор использующийся в адресной строке браузера
          name: 'slug',
          required: false,
          default: '', // для текстовых полей если required = false - указываеть по умолчанию
        },
        {
          // коллекция картинок
          name: 'pictures',
          required: false,
          default: [], // используем в thingAddRoute роуте и утилите getDeletedThing
          type: '[PictureInputType]',
          fields: pictureFields, // поля для конструировани полей gql-запроса / мутации
        },
      ],
      subDocumentFields: [],
      textFields: [],
      thingName: 'Article',
    };
    const expectedResult = {
      subject: null,
      section: null,
      slug: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
      content: {
        uk: null,
        ru: null,
        en: null,
      },
      shortTitle: {
        uk: null,
        ru: null,
        en: null,
      },
      pictures: {
        engaged: null,
        md5Hash: null,
        src: null,
        width: null,
        height: null,
        size: null,
        uploadedAt: null,
        initialName: null,
        caption: {
          uk: null,
          ru: null,
          en: null,
        },
      },
    };
    const result = composeGqlFieldsForThing(thingConfig);
    expect(result).toEqual(expectedResult);
  });
  test('should return some fields for Article thing', () => {
    const thingConfig = {
      paramFields: [
        {
          name: 'subject',
          multiple: false,
          required: true,
        },
        {
          name: 'section',
          multiple: false,
          required: true,
        },
      ],
      thingName: 'Article',
    };
    const expectedResult = {
      subject: null,
      section: null,
    };
    const result = composeGqlFieldsForThing(thingConfig);
    expect(result).toEqual(expectedResult);
  });
  test('should return fields for Service thing', () => {
    const Feature = {
      booleanFields: [],
      dateFields: [],
      i18nFields: [
        {
          name: 'title',
          required: true,
        },
      ],
      numberFields: [
        {
          default: 0,
          name: 'fee',
          required: true,
        },
        {
          default: 0,
          name: 'tax',
          required: true,
        },
      ],
      paramFields: [],
      specialFields: [],
      subDocumentFields: [],
      textFields: [],
      subDocumentName: 'Feature',
    };
    const thingConfig = {
      booleanFields: [],
      dateFields: [],
      i18nFields: [
        {
          name: 'title',
          required: true,
        },
        {
          name: 'specification',
        },
      ],
      numberFields: [],
      paramFields: [
        {
          name: 'subject',
          multiple: false,
          required: true,
        },
      ],
      specialFields: [],
      subDocumentFields: [
        {
          name: 'feature',
          array: false,
          attributes: Feature,
        },
      ],
      textFields: [],
      thingName: 'Service',
    };
    const expectedResult = {
      subject: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
      specification: {
        uk: null,
        ru: null,
        en: null,
      },
      feature: {
        id: null,
        title: {
          uk: null,
          ru: null,
          en: null,
        },
        fee: null,
        tax: null,
      },
    };
    const result = composeGqlFieldsForThing(thingConfig);
    expect(result).toEqual(expectedResult);
  });
});
