import gql from 'graphql-tag';

import { composeGql } from '../utils';
// функция возвращает запрос вида
/*
query Excerpt($subject: String!, $section: String!) {
  excerpt(thingName: "Article", subject: $subject, section: $section) {
    _id
    items
  }
} */

// кеш для уже построенных запросов
const excerptGqls = [];

const composeExcerpt = thingConfig => {
  // получаем все поля которые используются в Thing
  const { paramFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (excerptGqls[thingName]) return excerptGqls[thingName];

  // конструируем имя запроса
  const queryName = 'excerpt';

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  const args = [
    {
      name: 'thingName',
      value: `"${thingName}"`,
    },
  ];

  paramFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'String' });
    return prev;
  }, args);

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются всегда 2 поля _id и items
  const queryFields = {
    _id: null,
    items: null,
  };

  // сохраняем созданный запрос в кеше ...
  excerptGqls[thingName] = gql(composeGql(queryName, args, [], queryFields));
  // ... и возвращаем его
  return excerptGqls[thingName];
};

export default composeExcerpt;
