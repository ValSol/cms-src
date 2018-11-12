import gql from 'graphql-tag';

import { composeGqlFieldsForThing, composeGql } from '../../../core/utils';
// функций возвращает запрос вида
/*
mutation addArticle($_id: String, $subject: [String]!, $section: String!, $slug: String!,
  $title: I18nStringsInputType!, $shortTitle: I18nStringsInputType!,
  $content: I18nStringsInputType!,$pictures: [PictureInputType]) {
  addArticle(_id: $_id, subject: $subject, section: $section, slug: $slug, title: $title,
  shortTitle: $shortTitle, content: $content, pictures: $pictures) {
    _id
    createdAt
    updatedAt
    subject
    section
    slug
    title {
      uk
      ru
      en
    }
    shortTitle {
      uk
      ru
      en
    }
    content {
      uk
      ru
      en
    }
    pictures {
      engaged
      md5Hash
      src
      width
      height
      size
      uploadedAt
      initialName
      caption {
        uk
        ru
        en
      }
    }
  }
}
*/

// кеш для уже построенных мутаций
const addThinGqls = [];

const composeAddThing = thingConfig => {
  // получаем все поля которые используются в Thing
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    subDocumentFields,
    textFields,
    thingName,
  } = thingConfig;
  // если такая мутация уже была построена - просто возвращаем его
  if (addThinGqls[thingName]) return addThinGqls[thingName];

  // конструируем имя запроса
  const mutationName = `add${thingName}`;

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // при этом используются ВСЕ поля указанной thing
  const args = [
    {
      name: '_id',
      type: 'String',
    },
  ];

  booleanFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `Boolean${required ? '!' : ''}` });
    return prev;
  }, args);

  dateFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `GraphQLDateTime${required ? '!' : ''}` });
    return prev;
  }, args);

  i18nFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `I18nStringsInputType${required ? '!' : ''}` });
    return prev;
  }, args);

  numberFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `Float${required ? '!' : ''}` });
    return prev;
  }, args);

  paramFields.reduce((prev, { name, multiple, required }) => {
    prev.push({
      name,
      type: `${multiple ? '[' : ''}String${multiple ? ']' : ''}${
        required ? '!' : ''
      }`,
    });
    return prev;
  }, args);

  specialFields.reduce((prev, { name, required, type }) => {
    prev.push({
      name,
      type: `${type || 'String'}${required ? '!' : ''}`,
    });
    return prev;
  }, args);

  textFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `String${required ? '!' : ''}` });
    return prev;
  }, args);

  subDocumentFields.reduce((prev, { name, array, attributes, required }) => {
    const { subDocumentName } = attributes;
    const subDocumentType = `${subDocumentName}InputType${required ? '!' : ''}`;
    prev.push({
      name,
      type: array ? `[${subDocumentType}]` : subDocumentType,
    });
    return prev;
  }, args);

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются ВСЕ поля указанной thing

  const mutationFields = {
    _id: null,
    createdAt: null,
    updatedAt: null,
    backLinks: {
      item: null,
      itemThingName: null,
    },
  };

  composeGqlFieldsForThing(thingConfig, mutationFields);

  addThinGqls[thingName] = gql(
    composeGql(mutationName, args, [], mutationFields, true),
  );
  return addThinGqls[thingName];
};

export default composeAddThing;
