import gql from 'graphql-tag';
import { plural } from 'pluralize';

import { composeGql } from '../../../core/utils';
// функций возвращает запрос вида
/*
query articlesStatus {
  articlesStatus {
    excerptErrors
    textIndexErrors
  }
} */
// кеш для уже построенных запросов
const thingsStatusGqls = [];

const composeThingsStatus = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsStatusGqls[thingName]) return thingsStatusGqls[thingName];

  // конструируем имя запроса
  const queryName = `${plural(thingName.toLowerCase())}Status`;

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // которые отсутствуют
  const args = [];

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса

  const queryFields = {
    excerptErrors: null,
    textIndexErrors: null,
    backLinksErrors: null,
  };
  // сохраняем созданный запрос в кеше ...
  thingsStatusGqls[thingName] = gql(
    composeGql(queryName, args, [], queryFields),
  );
  // ... и возвращаем его
  return thingsStatusGqls[thingName];
};

export default composeThingsStatus;
