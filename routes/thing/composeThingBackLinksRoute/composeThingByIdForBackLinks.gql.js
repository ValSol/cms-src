import gql from 'graphql-tag';

import { locales } from '../../../appConfig';
import { composeGql } from '../../../core/utils';

// функций возвращает запрос вида
/*
query article($_id: ID, $uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
  article(_id: $_id) {
    _id
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
*/

// кеш для уже построенных запросов
const thingForBackLinksGqls = [];

const composeThingByIdForBackLinks = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingForBackLinksGqls[thingName]) return thingForBackLinksGqls[thingName];

  // конструируем имя запроса
  const queryName = thingName.toLowerCase();

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
  // при в резульатах выдаем только _id, title и backLinks

  // формируем вспомогательный словарь локалей с директивами
  const langsWithInclude = locales.reduce(
    (prev, locale) => ({
      ...prev,
      [`${locale} @include(if: $${locale})`]: null,
    }),
    {},
  );

  const queryFields = {
    _id: null,
    title: langsWithInclude,
    backLinks: {
      item: null,
    },
  };

  // сохраняем созданный запрос в кеше ...
  thingForBackLinksGqls[thingName] = gql(
    composeGql(queryName, args, argsForDirectives, queryFields),
  );
  // ... и возвращаем его
  return thingForBackLinksGqls[thingName];
};

export default composeThingByIdForBackLinks;
