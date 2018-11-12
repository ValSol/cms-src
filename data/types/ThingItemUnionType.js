import { GraphQLUnionType } from 'graphql/type';

import { thingNames } from '../../appConfig';
import { composeThingType } from '../types';

const ThingItemUnionType = new GraphQLUnionType({
  description: 'Item for populated Excerpt or BackLinks',
  name: 'ThingItemUnionType',
  types: thingNames.map(thingName => composeThingType(thingName, false, true)),
  resolveType({ thingName }) {
    if (thingNames.includes(thingName)) {
      return composeThingType(thingName, false, true);
    }
    throw new TypeError(
      `Uknown thingName: "${thingName}" of populated object!`,
    );
  },
});

export default ThingItemUnionType;
