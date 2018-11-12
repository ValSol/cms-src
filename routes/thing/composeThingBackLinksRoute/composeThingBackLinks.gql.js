import gql from 'graphql-tag';

import { composeGql } from '../../../core/utils';
import { locales, thingNames } from '../../../appConfig';

// функций возвращает запрос вида
/*
query articleBackLinks($_id: ID, $uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
  articleBackLinks(_id: $_id) {
    ... on ArticleType {
      _id
      createdAt
      updatedAt
      title {
        uk @include(if: $uk)
        ru @include(if: $ru)
        en @include(if: $en)
      }
      backLinks {
        item
      }
    }
  }
} */
// кеш для уже построенных запросов
const thingBackLinksGqls = [];

const composeThingById = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingBackLinksGqls[thingName]) return thingBackLinksGqls[thingName];

  // конструируем имя запроса
  const queryName = `${thingName.toLowerCase()}BackLinks`;

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

  // формируем вспомогательный словарь локалей с директивами
  const langsWithInclude = locales.reduce(
    (prev, locale) => ({
      ...prev,
      [`${locale} @include(if: $${locale})`]: null,
    }),
    {},
  );

  // формируем вспомогательный полей получаемых для каждого типа thing
  const querySubFields = {
    _id: null,
    createdAt: null,
    updatedAt: null,
    title: langsWithInclude,
    backLinks: {
      item: null,
    },
  };

  // и наконец формируем результирующие поля
  const queryFields = thingNames.reduce(
    (prev, name) => ({
      ...prev,
      [`... on ${name}Type`]: querySubFields,
    }),
    {},
  );

  // сохраняем созданный запрос в кеше ...
  thingBackLinksGqls[thingName] = gql(
    composeGql(queryName, args, argsForDirectives, queryFields),
  );
  // ... и возвращаем его
  return thingBackLinksGqls[thingName];
};

export default composeThingById;
