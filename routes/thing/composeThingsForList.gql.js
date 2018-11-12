import gql from 'graphql-tag';
import { plural } from 'pluralize';

import { locales } from '../../appConfig';
import { composeGql, composeGqlFieldsForThing } from '../../core/utils';

// функций возвращает запрос вида
/*
query articles($uk: Boolean!, $ru: Boolean!, $en: Boolean!) {
  articles {
    _id
    subject
    section
    slug
    createdAt
    updatedAt
    title {
      uk @include(if: $uk)
      ru @include(if: $ru)
      en @include(if: $en)
    }
    backLinks {
      item,
    }
  }
}
*/

// кеш для уже построенных запросов
const thingsGqls = [];

const composeThingsForList = thingConfig => {
  // получаем все поля которые используются в Thing
  const { paramFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsGqls[thingName]) return thingsGqls[thingName];

  // конструируем имя запроса
  const queryName = plural(thingName.toLowerCase());

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это пустой массив :-)
  const args = [];

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

  const queryFields = {
    _id: null,
    createdAt: null,
    updatedAt: null,
    title: langsWithInclude,
    backLinks: {
      item: null,
    },
  };

  // формируем поля-справочки
  composeGqlFieldsForThing({ paramFields }, queryFields);

  // сохраняем созданный запрос в кеше ...
  thingsGqls[thingName] = gql(
    composeGql(queryName, args, argsForDirectives, queryFields),
  );
  // ... и возвращаем его
  return thingsGqls[thingName];
};

export default composeThingsForList;
