import { GraphQLNonNull, GraphQLList, GraphQLString } from 'graphql/type';
import { getThingConfig, params } from '../../../appConfig';
import { isParamNamesCorrespondExcerptFieldSets } from '../../../core/utils';
import PopulatedExcerptType from '../../types/PopulatedExcerptType';
import { getExcerptModel } from '../../mongooseModels';

const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const populatedExcerpts = {
  type: new GraphQLList(PopulatedExcerptType),
  description:
    'List of populatedExcerpts all or selected by params and/or paramNames',
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
    let excerpts;

    if (!Object.keys(rest).length) {
      // если аргументов нет ищем всё
      excerpts = await Excerpt.find()
        .populate('items')
        .exec();
    } else {
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

      excerpts = await Excerpt.find(rest)
        .populate('items')
        .exec();
    }

    // каждое "заполненный" item должен содержать thingName - тип заполнения
    // кроме того приводим i18n поля к виду пригодному для graphql
    return excerpts.map(excerpt => {
      const { items, ...result } = excerpt.toObject();
      result.items = items.map(item => ({
        ...item,
        thingName,
      }));
      return result;
    });
  },
};

export default populatedExcerpts;
