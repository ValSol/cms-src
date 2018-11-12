/* eslint-env jest */
import mongoose from 'mongoose';

import * as specialMongooseFieldDeclarations from './specialMongooseFieldDeclarations';
import composeThingSchemaProperties from './composeThingSchemaProperties';

const { Schema } = mongoose;

describe('composeThingSchemaProperties data mongooseModels util', () => {
  const locales = ['uk', 'ru', 'en'];
  const params = {
    subject: ['trademark', 'copyright', 'patent', 'design'],
    section: ['info', 'services'],
  };
  const appConfig = { locales, params };
  const thingConfig = {
    thingName: 'Article',
    booleanFields: [
      {
        name: 'show',
        required: true,
        default: true,
      },
    ],
    dateFields: [
      {
        name: 'published',
        default: new Date(2018, 3, 1, 9, 0, 0, 0),
        required: false,
      },
    ],
    i18nFields: [
      {
        name: 'title',
        required: true,
      },
    ],
    numberFields: [
      {
        name: 'rating',
        required: true,
        default: 4,
      },
    ],
    paramFields: [
      {
        name: 'subject',
        default: 'copyright',
        multiple: true,
        required: true,
      },
      {
        name: 'section',
        default: 'info',
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
        // type: '[PictureInputType]', // для конструировани полей gql-запроса / мутации
        // fields: pictureFields, // поля для конструировани полей gql-запроса / мутации
      },
    ],
    textFields: [
      {
        name: 'slug2',
        default: '',
        required: true,
      },
    ],
    subDocumentFields: [],
  };
  const expectedResult = {
    show: {
      type: Boolean,
      required: true,
      default: true,
    },
    published: {
      type: Date,
      required: false,
      default: new Date(2018, 3, 1, 9, 0, 0, 0),
    },
    title: {
      uk: {
        type: String,
        required: true,
        default: '',
      },
      ru: {
        type: String,
        required: true,
        default: '',
      },
      en: {
        type: String,
        required: true,
        default: '',
      },
    },
    rating: {
      type: Number,
      required: true,
      default: 4,
    },
    subject: {
      type: [String],
      default: 'copyright',
      enum: ['trademark', 'copyright', 'patent', 'design'],
      required: true,
    },
    section: {
      type: String,
      default: 'info',
      enum: ['info', 'services'],
      required: true,
    },
    slug: {
      ...specialMongooseFieldDeclarations.slug,
      required: false,
      default: '',
    },
    pictures: {
      ...specialMongooseFieldDeclarations.pictures,
      required: false,
      default: [],
    },
    slug2: {
      type: String,
      required: true,
      default: '',
    },
    backLinks: [
      {
        itemThingName: String,
        item: {
          type: Schema.Types.ObjectId,
          refPath: 'backLinks.itemThingName',
        },
        _id: false,
      },
    ],
  };
  test('should compose schema properties', () => {
    const result = composeThingSchemaProperties(appConfig, thingConfig);
    expect(result).toEqual(expectedResult);
  });
  test('should compose schema properties with subDocumentFields', () => {
    const thingConfig2 = {
      ...thingConfig,
      subDocumentFields: [
        {
          name: 'features',
          array: true,
          attributes: thingConfig,
        },
        {
          name: 'feature',
          attributes: thingConfig,
        },
      ],
    };
    const result = composeThingSchemaProperties(appConfig, thingConfig2);
    const expectedResult2 = {
      ...expectedResult,
      features: [expectedResult],
      feature: expectedResult,
    };
    expect(result).toEqual(expectedResult2);
  });
});
