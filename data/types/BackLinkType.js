import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type';

const PictureType = new GraphQLObjectType({
  description: 'Back Link',
  name: 'BackLinkType',
  fields: {
    itemThingName: { type: new GraphQLNonNull(GraphQLString) },
    item: { type: new GraphQLNonNull(GraphQLID) },
  },
});

export default PictureType;
