import { GraphQLString, GraphQLList } from 'graphql/type';

import { getThingConfig, params } from '../../../appConfig';
import { composeThingType } from '../../types';
import { getThingModel } from '../../mongooseModels';

const composeThingsQuery = thingName => {
  const thingConfig = getThingConfig(thingName);
  const { paramFields } = thingConfig;

  const input = false;
  const consideringRequired = true;
  const ThingType = composeThingType(thingName, input, consideringRequired);

  // задаем аргументы исходя из полей-справочников
  const queryArgs = paramFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = {
      name: `${name}Of${thingName}`,
      type: GraphQLString,
    };
    return prev;
  }, {});

  const things = {
    type: new GraphQLList(ThingType),
    description: `${thingName} List`,
    args: queryArgs,
    async resolve(parentValue, args) {
      // !!!! здесь должна быть проверка прав доступа

      // проверяем корректность полей-справочников
      paramFields.forEach(({ name }) => {
        if (args[name] && !params[name].includes(args[name])) {
          throw new TypeError(`Incorrect ${name}: ${args[name]}`);
        }
      });

      const Thing = await getThingModel(thingName);
      if (Object.keys(args)) {
        return Thing.find(args);
      }
      return Thing.find({});
    },
  };
  return things;
};

export default composeThingsQuery;
