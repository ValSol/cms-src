import { GraphQLID, GraphQLString } from 'graphql/type';

import deepEqual from 'deep-equal';

import { getThingConfig } from '../../../appConfig';
import { composeThingType } from '../../types';
import { getThingModel } from '../../mongooseModels';

const composeThingQuery = thingName => {
  const thingConfig = getThingConfig(thingName);
  const { compoundIndexFieldSets } = thingConfig;

  const input = false;
  const consideringRequired = true;
  const ThingType = composeThingType(thingName, input, consideringRequired);

  const queryArgs = {
    _id: {
      name: `idOf${thingName}`,
      type: GraphQLID,
    },
  };

  compoundIndexFieldSets.forEach(set => {
    set.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        name: `${name}of${thingName}`,
        type: GraphQLString,
      };
      return prev;
    }, queryArgs);
  });

  const thing = {
    type: ThingType,
    description: `${thingName} selected by _id or by members of unique compound indexs`,
    args: queryArgs,
    async resolve(parentValue, args) {
      const Thing = await getThingModel(thingName);

      const { _id, ...rest } = args;
      if (_id) return Thing.findById(_id);

      // проверяем соответствует ли набор параметров ...
      // ... заданным в compoundIndexFieldSets
      const argsArray = Object.keys(rest)
        .map(item => item)
        .sort();
      let correctArgs = false;
      compoundIndexFieldSets
        // eslint-disable-next-line consistent-return
        .forEach(set => {
          const indexFieldArray = set
            .reduce((prev, { name }) => {
              // eslint-disable-next-line no-param-reassign
              prev.push(name);
              return prev;
            }, [])
            .sort();
          // если значения массивов индекса и аргументов совпадают
          // значит можно делать запрос к базе даных используя переданные аргументы
          if (deepEqual(argsArray, indexFieldArray)) {
            correctArgs = true;
          }
        });
      if (correctArgs) return Thing.findOne(rest);
      // если запрос к базе данных не был сделан
      // значит набор параметров неправильный
      throw new TypeError(`Incorrect set of args: ${argsArray.join(', ')}`);
    },
  };
  return thing;
};

export default composeThingQuery;
