import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql/type';

import { getThingConfig, params } from '../../../appConfig';
import { isParamNamesCorrespondExcerptFieldSets } from '../../../core/utils';
import { ExcerptType } from '../../types';
import { getExcerptModel } from '../../mongooseModels';

// используем все возможные справочники используемые в приложении
// для всех things
const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const excerpt = {
  type: ExcerptType,
  description: 'Excerpt selected by params or by Id',
  args: {
    _id: {
      name: 'excerptID',
      type: GraphQLID,
    },
    ...paramFields,
    thingName: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(root, args) {
    const { _id, thingName, ...rest } = args;
    const Excerpt = await getExcerptModel(thingName);
    if (_id) {
      const argNames = Object.keys(rest);
      // если _id и (возможно) единственный аргумент - возвращаем результат запроса к БД
      if (!argNames.length) return Excerpt.findById(_id);
      // если имеются еще аргументы возбуждаем ошибку
      throw new TypeError(
        `Redundant argument${argNames.length === 1 ? '' : 's'}: ${argNames.join(
          ', ',
        )} along with _id arg`,
      );
    }

    // проверяем соовтетсвие набора параметров передаваемых в аргументах ...
    // ... какому либо из наборов параметров из excerptFieldSets
    const paramNames = JSON.stringify(Object.keys(rest).sort());

    const thingConfig = getThingConfig(thingName);
    if (!isParamNamesCorrespondExcerptFieldSets(thingConfig, paramNames)) {
      const argNames = Object.keys(rest);
      // если заданные в аргуметнах параметры не соответствуют никакому ...
      // ... из груп параметров в excerptFieldSets - возбуждаем ошибку
      throw new TypeError(
        `Argument${argNames.length === 1 ? '' : 's'}: ${argNames.join(
          ', ',
        )} not correspond to any excerptFieldSets set`,
      );
    }
    // если заданные параметры соответствуют значению paramNames ...
    // ... возвращаем возвращаем результат запроса к БД
    return Excerpt.findOne({ ...rest, paramNames });
  },
};

export default excerpt;
