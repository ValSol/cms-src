import gql from 'graphql-tag';
import { plural } from 'pluralize';

import { composeGql } from '../utils';
// функций возвращает запрос вида
/*
mutation importArticles($things: [ArticleInputType], $excerpts: [ExcerptInputType]) {
  importArticles(things: $things, excerpts: $excerpts) {
    _id
  }
} */
// кеш для уже построенных запросов
const thingsImportGqls = [];

const composeThingsImport = thingConfig => {
  // получаем все поля которые используются в Thing
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsImportGqls[thingName]) return thingsImportGqls[thingName];

  // конструируем имя запроса
  const queryName = `import${plural(thingName)}`;

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это только thingName (т.е. получаем все excerpts для данной thingName)
  const args = [
    {
      name: 'things',
      type: `[${thingName}NotConsideringRequiredInputType]`,
    },
    {
      name: 'excerpts',
      type: '[ExcerptInputType]',
    },
  ];

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // в нашем случае только _id

  const queryFields = {
    _id: null,
  };

  // сохраняем созданный запрос в кеше ...
  thingsImportGqls[thingName] = gql(
    composeGql(queryName, args, [], queryFields, true),
  );
  // ... и возвращаем его
  return thingsImportGqls[thingName];
};

export default composeThingsImport;
