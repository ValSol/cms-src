// @flow

import {
  InMemoryCache,
  // ***********************************************************************
  // импортируем дополнительную утилиту
  IntrospectionFragmentMatcher,
  // ***********************************************************************
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';

// *****************************
// здесь импортируем ДОПОЛНИТЕЛЬНЫЕ модули
import { thingNames } from '../../appConfig';
// *****************************

function dataIdFromObject(obj) {
  switch (obj.__typename) {
    case 'IntlMessage':
      // Do not use id as identifier for message because it's not unique between languages
      // instead instruct cache to build path and index identifier for cache key
      return null;
    case 'NewsItem':
      return obj.link ? `NewsItem:${obj.link}` : defaultDataIdFromObject(obj);
    default:
      // return defaultDataIdFromObject(obj);
      // ***********************************************************************
      // задаем кастомный способ вычисления id для того или иного объекта данных
      // не используем простое просто obj._id в качесте id, ...
      // ... а учитываем __typename, чтобы отличать объекты имеющие ...
      // ... один _id, но разнычные __typename
      // например ExcertType и PopulatedExcerptType
      return obj.__typename && obj._id // eslint-disable-line no-underscore-dangle
        ? `${obj.__typename}-${obj._id}` // eslint-disable-line no-underscore-dangle
        : defaultDataIdFromObject(obj);
    // *************************************************************************
  }
}

// *****************************************************************************
// создаем fragmentMatcher чтобы можно было получать фрагменты UNION типов
// информация на тему:
// http://dev.apollodata.com/react/initialization.html#fragment-matcher
const possibleTypes = thingNames.reduce((prev, thingName) => {
  prev.push({ name: `${thingName}Type` });
  return prev;
}, []);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'UNION',
          name: 'ThingItemUnionType',
          possibleTypes,
        },
      ],
    },
  },
});
// *****************************************************************************

export default function createCache() {
  // https://www.apollographql.com/docs/react/basics/caching.html#configuration
  return new InMemoryCache({
    dataIdFromObject,
    // *************************************************************************
    // добавляем созданный выше fragmentMatcher
    fragmentMatcher,
    // *************************************************************************
  });
}
