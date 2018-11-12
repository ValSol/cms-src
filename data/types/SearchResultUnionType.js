import { GraphQLUnionType } from 'graphql/type';

import { thingNames } from '../../appConfig';
import { composeThingType } from '../types';

const SearchResultUnionType = new GraphQLUnionType({
  description: 'Объект предназначенный для отображения результатов поиска',
  name: 'SerchResult',
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

export default SearchResultUnionType;
