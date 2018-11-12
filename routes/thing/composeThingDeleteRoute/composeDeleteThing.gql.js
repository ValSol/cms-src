import gql from 'graphql-tag';
import { composeGql } from '../../../core/utils';

// функций возвращает мутацию вида
/*
mutation DeleteArticle($_id: ID!) {
  deleteArticle(_id: $_id) {
    _id
  }
} */
// кеш для уже построенных запросов
const deleteThingGqls = [];

const composeDeleteThing = thingConfig => {
  const { i18nFields, subDocumentFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (deleteThingGqls[thingName]) return deleteThingGqls[thingName];
  // конструируем имя мутации
  const mutationName = `delete${thingName}`;
  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это всего лишь один параметр: _id
  const args = [
    {
      name: '_id',
      type: 'ID!',
    },
  ];

  i18nFields.reduce((prev, { name, required }) => {
    prev.push({ name, type: `I18nStringsInputType${required ? '!' : ''}` });
    return prev;
  }, args);

  subDocumentFields.reduce((prev, { name, array, attributes, required }) => {
    const { subDocumentName } = attributes;
    const subDocumentType = `${subDocumentName}InputType${required ? '!' : ''}`;
    prev.push({
      name,
      type: array ? `[${subDocumentType}]` : subDocumentType,
    });
    return prev;
  }, args);

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // это всего лишь одно поле - _id
  const fields = {
    _id: null,
  };
  // сохраняем созданный запрос в кеше ...
  deleteThingGqls[thingName] = gql(
    composeGql(mutationName, args, [], fields, true),
  );
  // ... и возвращаем его
  return deleteThingGqls[thingName];
};

export default composeDeleteThing;
