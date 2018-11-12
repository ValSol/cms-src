import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql/type';
import { GraphQLDateTime } from 'graphql-iso-date';

import I18nStringsInputType from './I18nStringsInputType';

const PictureInputType = new GraphQLInputObjectType({
  description: 'Отдельная картинка',
  name: 'PictureInputType',
  fields: {
    src: { type: new GraphQLNonNull(GraphQLString) },
    caption: { type: I18nStringsInputType },
    initialName: { type: new GraphQLNonNull(GraphQLString) },
    engaged: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    md5Hash: { type: new GraphQLNonNull(GraphQLString) },
    width: { type: new GraphQLNonNull(GraphQLInt) },
    height: { type: new GraphQLNonNull(GraphQLInt) },
    size: { type: new GraphQLNonNull(GraphQLInt) },
    uploadedAt: { type: GraphQLDateTime },
  },
});

export default PictureInputType;
