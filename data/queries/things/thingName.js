import Promise from 'bluebird';

import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql/type';

import { thingNames } from '../../../appConfig';
import { getThingModel } from '../../mongooseModels';

const thingName = {
  type: GraphQLString,
  description: 'Get thing name by Id',
  args: {
    _id: {
      name: 'thingID',
      type: GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, args) {
    const { _id } = args;

    // формируем mongoose модели для выполнения запросов к БД
    const promises = thingNames.map(name => getThingModel(name));
    const thingModels = await Promise.all(promises);

    // выполняем запросы к БД
    const promises2 = thingModels.map(thingModel =>
      thingModel.findById(_id, { _id: 1 }),
    );
    const resultOfQueries = await Promise.all(promises2);

    // определяем какой запрос оказался успешным
    const resultIndex = resultOfQueries.findIndex(Boolean);

    return resultIndex === -1 ? null : thingNames[resultIndex];
  },
};

export default thingName;
