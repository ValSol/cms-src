import gql from 'graphql-tag';

import { composeGql } from '../../../core/utils';
// функций возвращает запрос вида
/*
query excerpts {
  articles(thingName: "Article") {
    _id
    paramNames
    subject
    section
    itms
  }
} */
// кеш для уже построенных запросов
const thingExcerptsGqls = [];

const composeThingsByParams = thingConfig => {
  // получаем все поля которые используются в Thing
  const { paramFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingExcerptsGqls[thingName]) return thingExcerptsGqls[thingName];

  // конструируем имя запроса
  const queryName = 'excerpts';

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это только thingName (т.е. получаем все excerpts для данной thingName)
  const args = [
    {
      name: 'thingName',
      value: `"${thingName}"`,
    },
  ];

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются ВСЕ поля указанной thing

  const queryFields = {
    _id: null,
    paramNames: null,
    items: null,
  };

  paramFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = null;
    return prev;
  }, queryFields);

  // сохраняем созданный запрос в кеше ...
  thingExcerptsGqls[thingName] = gql(
    composeGql(queryName, args, [], queryFields),
  );
  // ... и возвращаем его
  return thingExcerptsGqls[thingName];
};

export default composeThingsByParams;
