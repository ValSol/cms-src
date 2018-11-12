import {
  GraphQLInputObjectType,
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

const ExcerptInputType = new GraphQLInputObjectType({
  description: 'Excerpt of ordered items Input Type',
  name: 'ExcerptInputType',
  fields: {
    _id: { type: GraphQLID },
    ...paramFields,
    paramNames: { type: new GraphQLNonNull(GraphQLString) },
    thingName: { type: GraphQLString },
    items: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
});

export default ExcerptInputType;
