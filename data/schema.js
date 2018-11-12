import { GraphQLSchema, GraphQLObjectType } from 'graphql/type';

import { plural } from 'pluralize';

import { thingNames } from '../appConfig';
import {
  composeThingsStatusQuery,
  composeThingQuery,
  composeThingsQuery,
  composeThingBackLinksQuery,
  thingName as thingNameQuery,
} from './queries/things';
import {
  excerpt,
  excerpts,
  populatedExcerpt,
  populatedExcerpts,
} from './queries/excerpts';
import { user } from './queries/users';
import { search } from './queries/search';
import { signup, signin, signout } from './mutations/users';
import { updateExcerpt } from './mutations/excerpts';
import {
  composeThingAddMutation,
  composeThingDeleteMutation,
  composeThingsImportMutation,
  composeThingUpdateMutation,
} from './mutations/things';

// --------
// временно
import intl from './queries/intl';
// --------

// формируем поля для запросов
const rootQueryFields = {
  user,
  excerpt,
  excerpts,
  populatedExcerpt,
  populatedExcerpts,
  search,
  thingName: thingNameQuery,
  // --------
  // временно
  intl,
  // --------
};

thingNames.reduce((prev, thingName) => {
  const fieldName = thingName.toLowerCase();
  // eslint-disable-next-line no-param-reassign
  prev[fieldName] = composeThingQuery(thingName);

  const fieldName2 = plural(fieldName);
  // eslint-disable-next-line no-param-reassign
  prev[fieldName2] = composeThingsQuery(thingName);

  const fieldName3 = `${fieldName2}Status`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName3] = composeThingsStatusQuery(thingName);

  const fieldName4 = `${fieldName}BackLinks`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName4] = composeThingBackLinksQuery(thingName);

  return prev;
}, rootQueryFields);

// формируем поля для мутаций
const rootMutationFields = {
  signup,
  signin,
  signout,
  updateExcerpt,
};

thingNames.reduce((prev, thingName) => {
  const fieldName = `add${thingName}`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName] = composeThingAddMutation(thingName);

  const fieldName2 = `update${thingName}`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName2] = composeThingUpdateMutation(thingName);

  const fieldName3 = `delete${thingName}`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName3] = composeThingDeleteMutation(thingName);

  const fieldName4 = `import${plural(thingName)}`;
  // eslint-disable-next-line no-param-reassign
  prev[fieldName4] = composeThingsImportMutation(thingName);

  return prev;
}, rootMutationFields);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: rootQueryFields,
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: rootMutationFields,
  }),
});

export default schema;
