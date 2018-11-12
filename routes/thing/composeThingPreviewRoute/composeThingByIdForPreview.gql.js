import gql from 'graphql-tag';

import { locales } from '../../../appConfig';
import {
  composeGql,
  composeGqlFieldsForThing,
  addIncludeDirectivesAfterLocaleFields,
} from '../../../core/utils';

// функций возвращает запрос вида
/*
query article($_id: ID, $uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
  article(_id: $_id) {
    _id
    createdAt
    updatedAt
    subject
    section
    slug
    title {
      uk @include(if: $uk)
      ru @include(if: $ru)
      en @include(if: $en)
    }
    shortTitle {
      uk @include(if: $uk)
      ru @include(if: $ru)
      en @include(if: $en)
    }
    content {
      uk @include(if: $uk)
      ru @include(if: $ru)
      en @include(if: $en)
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
        uk @include(if: $uk)
        ru @include(if: $ru)
        en @include(if: $en)
      }
    }
    backLinks {
      item
    }
  }
}
*/

// кеш для уже построенных запросов
const thingGqls = [];

const composeThingById = thingConfig => {
  // получаем все поля которые используются в Thing
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    textFields,
    thingName,
  } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingGqls[thingName]) return thingGqls[thingName];

  // конструируем имя запроса
  const queryName = `${thingName.toLowerCase()}`;

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это всего лишь один параметр: _id
  const args = [
    {
      name: '_id',
      type: 'ID!',
    },
  ];

  // формируем входящие аргументы используемые только в директивах
  // а НЕ в gql запросе, например: ($uk: Boolean!, $ru: Boolean!, $en: Boolean!)
  const argsForDirectives = locales.reduce((prev, locale) => {
    prev.push({ name: `${locale}`, type: 'Boolean!' });
    return prev;
  }, []);

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются ВСЕ поля указанной thing

  const queryFields = {
    _id: null,
    backLinks: {
      item: null,
    },
  };
  composeGqlFieldsForThing(
    {
      booleanFields,
      dateFields,
      numberFields,
      paramFields,
      textFields,
    },
    queryFields,
  );

  // формируем вспомогательный словарь локалей с директивами
  const langsWithInclude = locales.reduce(
    (prev, locale) => ({
      ...prev,
      [`${locale} @include(if: $${locale})`]: null,
    }),
    {},
  );

  i18nFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = langsWithInclude;
    return prev;
  }, queryFields);

  specialFields.reduce((prev, { name, fields }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = fields ? addIncludeDirectivesAfterLocaleFields(fields) : null;
    return prev;
  }, queryFields);

  // сохраняем созданный запрос в кеше ...
  thingGqls[thingName] = gql(
    composeGql(queryName, args, argsForDirectives, queryFields),
  );
  // ... и возвращаем его
  return thingGqls[thingName];
};

export default composeThingById;
