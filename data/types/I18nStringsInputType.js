import { GraphQLInputObjectType, GraphQLString } from 'graphql/type';

const I18nStringsInputType = new GraphQLInputObjectType({
  description: 'Объект содержащий переводы на ряд языков',
  name: 'I18nStringsInputType',
  fields: {
    uk: { type: GraphQLString },
    ru: { type: GraphQLString },
    en: { type: GraphQLString },
  },
});

export default I18nStringsInputType;
