import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql/type';

import { getThingConfig, params } from '../../../appConfig';
import { isParamNamesCorrespondExcerptFieldSets } from '../../../core/utils';
import PopulatedExcerptType from '../../types/PopulatedExcerptType';
import { getExcerptModel } from '../../mongooseModels';

/* для выполнения запроса НЕОБХОДИМО использовать фрагменты!
   так как в типе возвращаемого значения используется union-тип.
   Пример:
   {
     populatedExcerpt(thingName: "Article", subject: "patent",
        section: "info", paramNames: "[\"subject\",\"section\"]") {
       items {
         ... on ArticleType {
           _id
           slug
         }
       }
     }
   }
*/

// используем все возможные справочники используемые в приложении
// для всех things
const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const populatedExcerpt = {
  type: PopulatedExcerptType,
  description: 'Populated excerpt selected by params or by Id',
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
    // здесь получаем информацию по выборке
    const Excerpt = await getExcerptModel(thingName);
    let excerpt;
    if (_id) {
      excerpt = await Excerpt.findById(_id)
        .populate('items')
        .exec();
    } else {
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

      excerpt = await Excerpt.findOne({ ...rest, paramNames })
        .populate('items')
        .exec();
    }
    // каждое "заполненный" item должен содержать thingName - тип заполнения
    const { items, ...result } = excerpt.toObject();
    result.items = items.map(item => ({ ...item, thingName }));
    return result;
  },
};

export default populatedExcerpt;
