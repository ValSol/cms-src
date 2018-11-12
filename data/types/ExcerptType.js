import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql/type';

import { params } from '../../appConfig';

// используем все возможные справочники используемые в приложении
// для всех things
const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const ExcerptType = new GraphQLObjectType({
  description: 'Excerpt of ordered items Type',
  name: 'ExcerptType',
  fields: {
    _id: { type: GraphQLID },
    ...paramFields,
    paramNames: { type: new GraphQLNonNull(GraphQLString) },
    thingName: { type: new GraphQLNonNull(GraphQLString) },
    items: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
});

export default ExcerptType;
