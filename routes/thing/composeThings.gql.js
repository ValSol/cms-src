import gql from 'graphql-tag';
import { plural } from 'pluralize';

import { composeGql } from '../../core/utils';

// используем для обновления после добавлнеия
// и редактирований thing

// функций возвращает запрос вида
/*
query Articles {
  articles{
    _id
  }
}
*/
// кеш для уже построенных запросов
const thingsGqls = [];

const composeThings = thingConfig => {
  const { thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsGqls[thingName]) return thingsGqls[thingName];
  // конструируем имя запроса
  const queryName = plural(thingName.toLowerCase());
  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // аргументов нет - пустой массив
  const args = [];
  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // это всег лишь одно поле _id
  const fields = {
    _id: null,
  };
  // сохраняем созданный запрос в кеше ...
  thingsGqls[thingName] = gql(composeGql(queryName, args, [], fields));
  // ... и возвращаем его
  return thingsGqls[thingName];
};

export default composeThings;
