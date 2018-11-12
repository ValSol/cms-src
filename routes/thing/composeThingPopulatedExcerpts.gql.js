import gql from 'graphql-tag';

import { composeGql } from '../../core/utils';

// используем для обновления после добавлнеия
// и редактирований thing
// функций возвращает запрос вида
/*
query PopulatedExcerpts {
  populatedExcerpts(thingName: "Article"){
    _id
    items {
      ... on ArticleType {
        _id
      }
    }
  }
}
*/

// кеш для уже построенных запросов
const thingsPopulatedExcerptsGqls = [];

const composeThingPopulatedExcerpts = thingConfig => {
  // получаем все поля необходимые для построения запроса
  const { paramFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsPopulatedExcerptsGqls[thingName]) {
    return thingsPopulatedExcerptsGqls[thingName];
  }
  // конструируем имя запроса
  const queryName = 'populatedExcerpts';
  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  const args = [
    {
      name: 'thingName',
      value: `"${thingName}"`,
    },
  ];
  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  //
  const fields = {
    _id: null,
    items: {
      [`... on ${thingName}Type`]: {
        _id: null,
      },
    },
  };
  // дополняем результирующие поля - полями-справочниками
  paramFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = null;
    return prev;
  }, fields);
  // сохраняем созданный запрос в кеше ...
  thingsPopulatedExcerptsGqls[thingName] = gql(
    composeGql(queryName, args, [], fields),
  );
  // ... и возвращаем его
  return thingsPopulatedExcerptsGqls[thingName];
};

export default composeThingPopulatedExcerpts;
