import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';
import { GraphQLDateTime } from 'graphql-iso-date';

import I18nStringsType from './I18nStringsType';

const PictureType = new GraphQLObjectType({
  description: 'Отдельная картинка',
  name: 'PictureType',
  fields: {
    src: { type: new GraphQLNonNull(GraphQLString) },
    md5Hash: { type: new GraphQLNonNull(GraphQLString) },
    caption: { type: I18nStringsType },
    initialName: { type: new GraphQLNonNull(GraphQLString) },
    engaged: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
    size: { type: new GraphQLNonNull(GraphQLInt) },
    uploadedAt: { type: new GraphQLNonNull(GraphQLDateTime) },
  },
});

export default PictureType;
