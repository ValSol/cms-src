import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql/type';

import { params } from '../../appConfig';
import ThingItemUnionType from './ThingItemUnionType';

// используем все возможные справочники используемые в приложении
// для все things
const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const PopulatedExcerptType = new GraphQLObjectType({
  description: 'Exerpt of ordered items with there all attributes',
  name: 'PopulatedExcerptType',
  fields: {
    _id: { type: GraphQLID },
    paramNames: { type: new GraphQLNonNull(GraphQLString) },
    ...paramFields,
    thingName: { type: new GraphQLNonNull(GraphQLString) },
    items: {
      type: new GraphQLNonNull(new GraphQLList(ThingItemUnionType)),
    },
  },
});

export default PopulatedExcerptType;
