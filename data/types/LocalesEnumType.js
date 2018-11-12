import { GraphQLEnumType } from 'graphql/type';

import { locales } from '../../appConfig';

const values = {};
locales.forEach(locale => {
  values[locale] = { value: locale };
});

const LocalesEnumType = new GraphQLEnumType({
  name: 'LocalesEnum',
  values,
});

export default LocalesEnumType;
