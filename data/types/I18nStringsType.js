import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql/type';

const I18nStringsType = new GraphQLObjectType({
  description: 'Объект содержащий переводы на ряд языков',
  name: 'I18nStringsType',
  fields: {
    uk: { type: new GraphQLNonNull(GraphQLString) },
    ru: { type: new GraphQLNonNull(GraphQLString) },
    en: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export default I18nStringsType;
