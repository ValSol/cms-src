import { GraphQLID, GraphQLNonNull, GraphQLList } from 'graphql/type';
import ThingItemUnionType from '../../types/ThingItemUnionType';
import { getThingModel } from '../../mongooseModels';

const composeThingBackLinksQuery = thingName => {
  const thingBackLinks = {
    type: new GraphQLList(ThingItemUnionType),
    description: 'List of Things',
    args: {
      _id: {
        name: `idOf${thingName}`,
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    async resolve(parentValue, args) {
      const { _id } = args;
      const Thing = await getThingModel(thingName);

      const thing = await Thing.findById(_id, { backLinks: 1 })
        .populate('backLinks.item')
        .exec();

      const { backLinks } = thing;

      // каждый элемент массива должен содержать thingName - тип заполнения
      const result = backLinks.map(backLink => {
        const { itemThingName, item } = backLink.toObject();
        return { ...item, thingName: itemThingName };
      });
      return result;
    },
  };
  return thingBackLinks;
};

export default composeThingBackLinksQuery;
