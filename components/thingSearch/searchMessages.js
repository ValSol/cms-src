import { defineMessages } from 'react-intl';
/* Используются в:
1) ThingSearchList компоненте
а также через контекст роута используются в
1) thingSearchRoute роуте
2) thingSearchFormsRoute роуте
*/

export default defineMessages({
  SearchFor: {
    id: 'Search.SearchFor',
    defaultMessage: 'Ищем',
  },
  Hits: {
    id: 'Search.Hits',
    defaultMessage: 'Результатов',
  },
});
