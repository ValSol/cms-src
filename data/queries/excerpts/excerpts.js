import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql/type';

import { getThingConfig, params } from '../../../appConfig';
import { isParamNamesCorrespondExcerptFieldSets } from '../../../core/utils';
import { ExcerptType } from '../../types';
import { getExcerptModel } from '../../mongooseModels';

const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const excerpts = {
  type: new GraphQLList(ExcerptType),
  description: 'List of excerpts all or selected by params and/or paramNames',
  args: {
    ...paramFields,
    thingName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    paramNames: {
      type: GraphQLString,
    },
  },
  async resolve(parentValue, args) {
    const { thingName, ...rest } = args;
    const { paramNames, ...rest2 } = rest;

    const Excerpt = await getExcerptModel(thingName);

    if (!Object.keys(rest).length) {
      // если аргументов нет ищем всё
      return Excerpt.find();
    }
    // проверяем соовтетсвие значения аргумента paramNames ...
    // ... используемым наборам параметров из excerptFieldSets
    const thingConfig = getThingConfig(thingName);
    if (!isParamNamesCorrespondExcerptFieldSets(thingConfig, paramNames)) {
      // если аргумент paramNames некорректный - возбуждаем ошибку
      throw new TypeError(
        `Argument paramNames: ${paramNames} not correspond to excerptFieldSets`,
      );
    }

    // проверяем соовтетсвие набора параметров передаваемых в аргументах ...
    // ... значению аргумента paramNames
    const paramNamesArray = JSON.parse(paramNames);

    const paramNamesCorrespondParams = Object.keys(rest2)
      // интересно что если массив пустой - возращается true (что нам и надо)
      .every(paramName => paramNamesArray.includes(paramName));

    if (!paramNamesCorrespondParams) {
      const argNames = Object.keys(rest2);
      // если заданные в аргуметнах параметры не соответствуют paramNames...
      // ... возбуждаем ошибку
      throw new TypeError(
        `Argument${argNames.length === 1 ? '' : 's'}: ${argNames.join(
          ', ',
        )} not correspond with paramNames argument: ${paramNames}`,
      );
    }

    return Excerpt.find(rest);
  },
};

export default excerpts;
