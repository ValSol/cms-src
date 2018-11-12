import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql/type';

import { getThingConfig, params } from '../../../appConfig';
import rbac from '../../../core/rbac';

import { ExcerptType } from '../../types';
import { getExcerptModel } from '../../mongooseModels';
import {
  isParamNamesCorrespondExcerptFieldSets,
  sameItems,
} from '../../../core/utils';

const paramFields = Object.keys(params).reduce((prev, paramName) => {
  // eslint-disable-next-line no-param-reassign
  prev[paramName] = { type: GraphQLString };
  return prev;
}, {});

const updateExcerpt = {
  type: ExcerptType,
  description: 'Update the excerpt',
  args: {
    _id: {
      type: GraphQLID,
    },
    ...paramFields,
    thingName: { type: new GraphQLNonNull(GraphQLString) },
    items: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
  },
  async resolve({ request: { user } }, args) {
    const { _id: id, thingName, items, ...rest } = args;

    // если пользователю НЕ разрешено обновлять exceprpt - выходим
    if (!rbac.can(`${thingName}:update`, { user })) return null;

    // проверяем соовтетсвие набора параметров передаваемых в аргументах ...
    // ... какому либо из наборов параметров из excerptFieldSets
    const paramNames = JSON.stringify(Object.keys(rest).sort());

    const thingConfig = getThingConfig(thingName);
    if (
      !id &&
      !isParamNamesCorrespondExcerptFieldSets(thingConfig, paramNames)
    ) {
      const argNames = Object.keys(rest);
      // если заданные в аргуметнах параметры не соответствуют никакому ...
      // ... из груп параметров в excerptFieldSets - возбуждаем ошибку
      throw new TypeError(
        `Argument${argNames.length === 1 ? '' : 's'}: ${argNames.join(
          ', ',
        )} not correspond to any excerptFieldSets set`,
      );
    }

    const Excerpt = await getExcerptModel(thingName);
    // проверяем что осуществляем переупордочивание элементов
    // БЕЗ удаления и добавления элементов
    const prevExcerpt = id
      ? await Excerpt.findById(id)
      : await Excerpt.findOne({ ...rest, paramNames });
    const { _id } = prevExcerpt;
    const prevItems = prevExcerpt.items.map(item => item.toString());
    const nextItems = items.map(item => item.toString());
    const message = 'Not same items in updated excerpt';
    if (!sameItems(prevItems, nextItems)) throw new TypeError(message);

    // обновляем элемент
    await Excerpt.update({ _id }, { items });
    return Excerpt.findById(_id);
  },
};

export default updateExcerpt;
