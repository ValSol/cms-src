import gql from 'graphql-tag';

import { composeGql } from '../../../core/utils';
// функций возвращает запрос вида
/*
mutation UpdateExcerpt($_id: ID, $items: [String]!) {
  updateExcerpt(thingName: "Article", _id: $_id, items: $items) {
    _id
    items
  }
}
*/

// кеш для уже построенных запросов
const updateExcerptGqls = [];

const composeUpdateExcerpt = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (updateExcerptGqls[thingName]) return updateExcerptGqls[thingName];

  // конструируем имя запроса
  const mutationName = 'updateExcerpt';

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  const args = [
    {
      name: '_id',
      type: 'ID',
    },
    {
      name: 'items',
      type: '[String]!',
    },
    {
      name: 'thingName',
      value: `"${thingName}"`,
    },
  ];

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются всегда 2 поля _id и items
  const fields = {
    _id: null,
    items: null,
  };
  // сохраняем созданный запрос в кеше ...
  updateExcerptGqls[thingName] = gql(
    composeGql(mutationName, args, [], fields, true),
  );
  // ... и возвращаем его
  return updateExcerptGqls[thingName];
};

export default composeUpdateExcerpt;
