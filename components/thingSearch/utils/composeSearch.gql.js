import gql from 'graphql-tag';

import { locales } from '../../../appConfig';
import { composeGql } from '../../../core/utils';

// функций возвращает запрос вида
/*
query SearchArticleList($query: String!, $locale: LocalesEnum!, $uk: Boolean!,
  $ru: Boolean!, $en: Boolean!){
  search(thingName: "Article", query: $query, locale: $locale) {
    ... on ArticleType {
      _id
      subject
      section
      slug
      score
      title {
        uk @include(if: $uk)
        ru @include(if: $ru)
        en @include(if: $en)
      }
    }
  }
} */

// кеш для уже построенных запросов
const searchGqls = [];

const composeSearch = thingConfig => {
  // получаем все поля которые используются в Thing
  const { permaLinkFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (searchGqls[thingName]) return searchGqls[thingName];

  // конструируем имя запроса
  const queryName = 'search';

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  const args = [
    {
      name: 'query',
      type: 'String!',
    },
    {
      name: 'locale',
      type: 'LocalesEnum!',
    },
    {
      name: 'thingName',
      value: `"${thingName}"`,
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

  const fields = {
    _id: null,
    score: null,
    title: langsWithInclude,
  };

  // добавляем в список полей поля которые понадобятся для задания permalink
  permaLinkFields.reduce((prev, name) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = null;
    return prev;
  }, fields);

  const queryFields = {
    [`... on ${thingName}Type`]: fields,
  };

  // сохраняем созданный запрос в кеше ...
  searchGqls[thingName] = gql(
    composeGql(queryName, args, argsForDirectives, queryFields),
  );
  // ... и возвращаем его
  return searchGqls[thingName];
};

export default composeSearch;
