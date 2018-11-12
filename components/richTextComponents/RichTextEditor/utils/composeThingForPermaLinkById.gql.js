import gql from 'graphql-tag';

import { composeGql } from '../../../../core/utils';
// функций возвращает запрос возвращающий только поля входящие в permaLinkFields

/*
query ArticleById($_id: ID) {
  article(_id: $_id) {
    _id
    subject
    section
    slug
  }
} */
// кеш для уже построенных запросов
const thingGqls = [];

const composeThingForPermaLinkById = thingConfig => {
  // получаем все поля которые используются в Thing
  const { permaLinkFields, thingName } = thingConfig;
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

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом получаем информацию об используемых полях из permaLinkFields

  const queryFields = permaLinkFields.reduce(
    (prev, name) => ({ ...prev, [name]: null }),
    { _id: null },
  );

  // сохраняем созданный запрос в кеше ...
  thingGqls[thingName] = gql(composeGql(queryName, args, [], queryFields));
  // ... и возвращаем его
  return thingGqls[thingName];
};

export default composeThingForPermaLinkById;
