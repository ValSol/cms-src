import gql from 'graphql-tag';

import { composeGql, composeGqlFieldsForThing } from '../../core/utils';
// функций возвращает запрос вида
/*
mutation UpdateArticle($_id: ID!, $subject: [String], $section: String, $slug: String,
$title: I18nStringsInputType, $shortTitle: I18nStringsInputType,
$content: I18nStringsInputType, $pictures: [PictureInputType]) {
  updateArticle(_id: $_id, subject: $subject, section: $section, slug: $slug,
  title: $title, shortTitle: $shortTitle, content: $content, pictures: $pictures) {
    _id
    subject
    section
    slug
    createdAt
    updatedAt
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
const updateThinGqls = [];

const composeUpdateThing = thingConfig => {
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
  if (updateThinGqls[thingName]) return updateThinGqls[thingName];

  // конструируем имя запроса
  const mutationName = `update${thingName}`;

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // при этом используются ВСЕ поля указанной thing
  const args = [
    {
      name: '_id',
      type: 'ID!',
    },
    {
      name: 'initial',
      type: `${thingName}NotConsideringRequiredInputType`,
    },
  ];

  booleanFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'Boolean' });
    return prev;
  }, args);

  dateFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'GraphQLDateTime' });
    return prev;
  }, args);

  i18nFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'I18nStringsInputType' });
    return prev;
  }, args);

  numberFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'Float' });
    return prev;
  }, args);

  paramFields.reduce((prev, { name, multiple }) => {
    prev.push({ name, type: multiple ? '[String]' : 'String' });
    return prev;
  }, args);

  specialFields.reduce((prev, { name, type }) => {
    prev.push({
      name,
      type: `${type || 'String'}`,
    });
    return prev;
  }, args);

  textFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'String' });
    return prev;
  }, args);

  subDocumentFields.reduce((prev, { name, array, attributes }) => {
    const { subDocumentName } = attributes;
    // так как не все поля могут обновляться - не учитываем обязательный поля
    // поэтому используем тип: NotConsideringRequiredInputType
    const subDocumentType = `${subDocumentName}NotConsideringRequiredInputType`;
    prev.push({ name, type: array ? `[${subDocumentType}]` : subDocumentType });
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

  updateThinGqls[thingName] = gql(
    composeGql(mutationName, args, [], mutationFields, true),
  );
  return updateThinGqls[thingName];
};

export default composeUpdateThing;
