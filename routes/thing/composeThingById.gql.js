import gql from 'graphql-tag';

import { composeGqlFieldsForThing, composeGql } from '../../core/utils';
// функций возвращает запрос вида
/*
query ArticleById($_id: ID) {
  article(_id: $_id) {
    _id
    subject
    section
    slug
    title {
      uk
      ru
      en
    }
    content {
      uk
      ru
      en
    }
    shortTitle {
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
    backLinks {
      item
    }
  }
} */
// кеш для уже построенных запросов
const thingGqls = [];

const composeThingById = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingGqls[thingName]) return thingGqls[thingName];

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

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются ВСЕ поля указанной thing

  const queryFields = composeGqlFieldsForThing(thingConfig, {
    _id: null,
    createdAt: null,
    updatedAt: null,
    backLinks: {
      item: null,
      itemThingName: null,
    },
  });

  // сохраняем созданный запрос в кеше ...
  thingGqls[thingName] = gql(composeGql(queryName, args, [], queryFields));
  // ... и возвращаем его
  return thingGqls[thingName];
};

export default composeThingById;
