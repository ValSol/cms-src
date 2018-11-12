import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';
import { GraphQLDateTime } from 'graphql-iso-date';

import { I18nStringsInputType, I18nStringsType } from '../types';
import * as specialFieldDeclarations from '../utils/specialFieldDeclarations';
import * as specialArgDeclarations from '../utils/specialArgDeclarations';

// утилита формирует graphql-поля общие для Thing и SubDocument
// attributes - object содержащий параметры формируемых полей
// input - boolean поля ввода или вывода (true / false)
// сonsideringRequired - boolean учитывать "обязательность" полей (true / false)

const composeFieldsForThingOrSubDocument = (
  attributes,
  input,
  сonsideringRequired,
) => {
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    textFields,
  } = attributes;

  const fields = {};

  // добавляем специальные поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  specialFields &&
    specialFields.reduce((prev, { name, required }) => {
      const declaration = input
        ? { ...specialArgDeclarations[name] }
        : { ...specialFieldDeclarations[name] };
      const type =
        сonsideringRequired && required
          ? new GraphQLNonNull(declaration.type)
          : declaration.type;
      // eslint-disable-next-line no-param-reassign
      prev[name] = { ...declaration, type };
      return prev;
    }, fields);

  // добавляем многоязычне поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  i18nFields &&
    i18nFields.reduce((prev, { name, required }) => {
      const I18nType = input ? I18nStringsInputType : I18nStringsType;
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(I18nType)
            : I18nType,
      };
      return prev;
    }, fields);

  // добавляем поля-справочники в словарь fields
  // eslint-disable-next-line no-unused-expressions
  paramFields &&
    paramFields.reduce((prev, { multiple, name, required }) => {
      const paramType = multiple
        ? new GraphQLList(GraphQLString)
        : GraphQLString;
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(paramType)
            : paramType,
      };
      return prev;
    }, fields);

  // добавляем логические поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  booleanFields &&
    booleanFields.reduce((prev, { name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(GraphQLBoolean)
            : GraphQLBoolean,
      };
      return prev;
    }, fields);

  // добавляем поля дата / время в словарь fields
  // eslint-disable-next-line no-unused-expressions
  dateFields &&
    dateFields.reduce((prev, { name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(GraphQLDateTime)
            : GraphQLDateTime,
      };
      return prev;
    }, fields);

  // добавляем числовые поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  numberFields &&
    numberFields.reduce((prev, { name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(GraphQLFloat)
            : GraphQLFloat,
      };
      return prev;
    }, fields);

  // добавляем текстовые поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  textFields &&
    textFields.reduce((prev, { name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type:
          сonsideringRequired && required
            ? new GraphQLNonNull(GraphQLString)
            : GraphQLString,
      };
      return prev;
    }, fields);

  // и возвращает результат
  return fields;
};

// экспортируем функцию которая берет тип из кеша или вычисялет его
export default composeFieldsForThingOrSubDocument;
