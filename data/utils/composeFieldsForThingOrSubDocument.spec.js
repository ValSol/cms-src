/* eslint-env jest */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';
import { GraphQLDateTime } from 'graphql-iso-date';

import { I18nStringsInputType, I18nStringsType } from '../types';
import * as specialArgDeclarations from '../utils/specialArgDeclarations';
import * as specialFieldDeclarations from '../utils/specialFieldDeclarations';
import composeFieldsForThingOrSubDocument from './composeFieldsForThingOrSubDocument';

describe('composeFieldsForThingOrSubDocument data mongooseModels util', () => {
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
      {
        name: 'content',
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
        default: ['copyright'],
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
        required: true,
        default: [], // используем в thingAddRoute роуте и утилите getDeletedThing
        // type: '[PictureType]', // для конструировани полей gql-запроса / мутации
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
    richTextFields: ['content'],
  };
  test('should compose fields for input=false, consideringRequired=false', () => {
    const input = false;
    const consideringRequired = false;
    const result = composeFieldsForThingOrSubDocument(
      thingConfig,
      input,
      consideringRequired,
    );
    const expectedResult = {
      show: {
        type: GraphQLBoolean,
      },
      published: {
        type: GraphQLDateTime,
      },
      title: {
        type: I18nStringsType,
      },
      content: {
        type: I18nStringsType,
      },
      rating: {
        type: GraphQLFloat,
      },
      subject: {
        type: new GraphQLList(GraphQLString),
      },
      section: {
        type: GraphQLString,
      },
      slug: {
        ...specialFieldDeclarations.slug,
      },
      pictures: {
        ...specialFieldDeclarations.pictures,
        type: specialFieldDeclarations.pictures.type,
      },
      slug2: {
        type: GraphQLString,
      },
    };
    expect(result).toEqual(expectedResult);
  });
  test('should compose fields for input=true, consideringRequired=false', () => {
    const input = true;
    const consideringRequired = false;
    const result = composeFieldsForThingOrSubDocument(
      thingConfig,
      input,
      consideringRequired,
    );
    const expectedResult = {
      show: {
        type: GraphQLBoolean,
      },
      published: {
        type: GraphQLDateTime,
      },
      title: {
        type: I18nStringsInputType,
      },
      content: {
        type: I18nStringsInputType,
      },
      rating: {
        type: GraphQLFloat,
      },
      subject: {
        type: new GraphQLList(GraphQLString),
      },
      section: {
        type: GraphQLString,
      },
      slug: {
        ...specialArgDeclarations.slug,
      },
      pictures: {
        ...specialArgDeclarations.pictures,
        type: specialArgDeclarations.pictures.type,
      },
      slug2: {
        type: GraphQLString,
      },
    };
    expect(result).toEqual(expectedResult);
  });
  test('should compose fields for fields=false, consideringRequired=true', () => {
    const expectedResult = {
      show: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      published: {
        type: GraphQLDateTime,
      },
      title: {
        type: new GraphQLNonNull(I18nStringsType),
      },
      content: {
        type: new GraphQLNonNull(I18nStringsType),
      },
      rating: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      subject: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      slug: {
        ...specialFieldDeclarations.slug,
      },
      pictures: {
        ...specialFieldDeclarations.pictures,
        type: new GraphQLNonNull(specialFieldDeclarations.pictures.type),
      },
      slug2: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
    const input = false;
    const consideringRequired = true;
    const result = composeFieldsForThingOrSubDocument(
      thingConfig,
      input,
      consideringRequired,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should compose fields for fields=true, consideringRequired=true', () => {
    const expectedResult = {
      show: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      published: {
        type: GraphQLDateTime,
      },
      title: {
        type: new GraphQLNonNull(I18nStringsInputType),
      },
      content: {
        type: new GraphQLNonNull(I18nStringsInputType),
      },
      rating: {
        type: new GraphQLNonNull(GraphQLFloat),
      },
      subject: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      },
      section: {
        type: new GraphQLNonNull(GraphQLString),
      },
      slug: {
        ...specialArgDeclarations.slug,
      },
      pictures: {
        ...specialArgDeclarations.pictures,
        type: new GraphQLNonNull(specialArgDeclarations.pictures.type),
      },
      slug2: {
        type: new GraphQLNonNull(GraphQLString),
      },
    };
    const input = true;
    const consideringRequired = true;
    const result = composeFieldsForThingOrSubDocument(
      thingConfig,
      input,
      consideringRequired,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should compose part fields for fields=true, consideringRequired=true', () => {
    const thingConfig2 = {
      thingName: 'Article',
      booleanFields: [
        {
          name: 'show',
          required: true,
          default: true,
        },
      ],
      i18nFields: [
        {
          name: 'title',
          required: true,
        },
        {
          name: 'content',
          required: true,
        },
      ],
      paramFields: [
        {
          name: 'subject',
          default: ['copyright'],
          multiple: true,
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
      ],
      richTextFields: ['content'],
    };
    const expectedResult = {
      show: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      title: {
        type: new GraphQLNonNull(I18nStringsInputType),
      },
      content: {
        type: new GraphQLNonNull(I18nStringsInputType),
      },
      subject: {
        type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      },
      slug: {
        ...specialArgDeclarations.slug,
      },
    };
    const input = true;
    const consideringRequired = true;
    const result = composeFieldsForThingOrSubDocument(
      thingConfig2,
      input,
      consideringRequired,
    );
    expect(result).toEqual(expectedResult);
  });
});
