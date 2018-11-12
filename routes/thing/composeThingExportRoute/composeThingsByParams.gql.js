import gql from 'graphql-tag';
import { plural } from 'pluralize';

import { composeGql, composeGqlFieldsForThing } from '../../../core/utils';
// функций возвращает запрос вида
/*
query Articles($subject: String, $section: String) {
  articles(subject: $subject, section: $section) {
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
  }
} */
// кеш для уже построенных запросов
const thingsGqls = [];

const composeThingsByParams = thingConfig => {
  // получаем все поля которые используются в Thing
  const { paramFields, thingName } = thingConfig;
  // если такой запрос уже был построен - просто возвращаем его
  if (thingsGqls[thingName]) return thingsGqls[thingName];

  // конструируем имя запроса
  const queryName = plural(thingName.toLowerCase());

  // ------------------------------------------------------------
  // формируем входящие аргументы gql запроса
  // это могут значения параметров (справочников), используемых в данной thing
  const args = paramFields.reduce((prev, { name }) => {
    prev.push({ name, type: 'String' });
    return prev;
  }, []);

  // ------------------------------------------------------------
  // формируем результирующие поля gql запроса
  // при этом используются ВСЕ поля указанной thing

  const queryFields = {
    _id: null,
    createdAt: null,
    updatedAt: null,
  };

  composeGqlFieldsForThing(thingConfig, queryFields);

  // сохраняем созданный запрос в кеше ...
  thingsGqls[thingName] = gql(composeGql(queryName, args, [], queryFields));
  // ... и возвращаем его
  return thingsGqls[thingName];
};

export default composeThingsByParams;
