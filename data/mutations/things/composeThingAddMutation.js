import Promise from 'bluebird';
import mongoose from 'mongoose';

import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type';

import { getThingConfig, locales } from '../../../appConfig';
import rbac from '../../../core/rbac';
import {
  composeExcerptFields,
  composeTextIndexFields,
} from '../../../core/utils';

import {
  composeFieldsForThingOrSubDocument,
  getLinksFromFields,
} from '../../utils';
import { composeSubDocumentType, composeThingType } from '../../types';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../mongooseModels';

const composeThingAddMutation = thingName => {
  const input = false;
  const consideringRequired = true;
  const ThingType = composeThingType(thingName, input, consideringRequired);
  const thingConfig = getThingConfig(thingName);
  const { subDocumentFields } = thingConfig;

  // задаем возможные аргументы
  const input2 = true;
  const consideringRequired2 = true;
  const mutationArgs = {
    // НЕ используем тип GraphQLID - потому что тогда возникает ошибка
    // для случая восстановления данных сохраненных в LocalStorage
    _id: { type: GraphQLString },
    ...composeFieldsForThingOrSubDocument(
      thingConfig,
      input2,
      consideringRequired2,
    ),
  };

  // добавляем subDocumentField поля
  subDocumentFields.reduce((prev, { name, array, attributes, required }) => {
    const subDocumentInputType = composeSubDocumentType(
      attributes,
      input2,
      consideringRequired2,
    );

    const subDocumentInputType2 = array
      ? new GraphQLList(subDocumentInputType)
      : subDocumentInputType;

    // eslint-disable-next-line no-param-reassign
    prev[name] =
      consideringRequired2 && required
        ? { type: new GraphQLNonNull(subDocumentInputType2) }
        : { type: subDocumentInputType2 };
    return prev;
  }, mutationArgs);

  const addThing = {
    type: ThingType,
    description: 'Add one new Thing',
    args: mutationArgs,

    async resolve(parentValue, args) {
      const { request: { user } } = parentValue;

      // если у пользователя нет прав на добавления thing - выходим
      if (!rbac.can(`${thingName}:add`, { user })) return null;

      // извлекаем из общего словаря полей информацию о ссылках
      const linksToAdd = getLinksFromFields(args, thingConfig);

      const Thing = await getThingModel(thingName);
      const thing = await Thing.create(args);
      const { _id, ...rest } = thing.toObject();

      const promises3 = [];

      // подготавливаем обновление (создание) документов во вспомогательной коллекции
      // которые содержат упорядоченные выборки документов (excerpts)

      const Excerpt = await getExcerptModel(thingName);
      const upsert = {
        $addToSet: { items: _id },
      };
      // формируем запрос к базе данных для каждого возможного набора параметров
      composeExcerptFields(thingConfig, rest).forEach(query => {
        // сохраняем сформированный запрос в массиве
        promises3.push(
          Excerpt.findOneAndUpdate(query, upsert, { upsert: true }),
        );
      });

      // подготавливаем создание документа во вспомогательных коллекциях
      // которые содержат индексы по каждому из языков
      const promises = locales.map(locale => getTextIndex(thingName, locale));
      const TextIndexes = await Promise.all(promises);
      locales.forEach((locale, i) => {
        // получаем очередную коллекцию
        const TextIndex = TextIndexes[i];
        // формируем аргументы для создания документа в коллекции
        const textIndexArgs = composeTextIndexFields(args, locale, thingConfig);
        // eslint-disable-next-line no-underscore-dangle
        textIndexArgs._item = _id;
        promises3.push(TextIndex.create(textIndexArgs));
      });

      // подготавливаем обновление полей backlinks во всех thing-объектах ...
      // ... на которые имеются ссылки в только что созданном thing-объекте
      const thingNames = linksToAdd.reduce(
        (prev, { thingName: thingName2 }) => {
          if (!prev.includes(thingName2)) prev.push(thingName2);
          return prev;
        },
        [],
      );
      const promises2 = thingNames.map(name => getThingModel(name));
      const Things = await Promise.all(promises2);
      const ThingsDict = thingNames.reduce(
        (prev, name, i) => ({ ...prev, [name]: Things[i] }),
        {},
      );

      const upsert2 = {
        $addToSet: {
          backLinks: {
            item: mongoose.Types.ObjectId(_id),
            itemThingName: thingName,
          },
        },
      };
      linksToAdd.forEach(({ _id: id, thingName: name }) => {
        // используем ThingsDict[name].collection.findOneAndUpdate то есть ...
        //  ... используем нативную функцию MongoDB вместо mongoosejs ...
        // ... чтобы предотвратить обновление поля updatedAt
        promises3.push(
          ThingsDict[name].collection.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            upsert2,
          ),
        );
      });

      // запускаем одновременно запросы ко всем запросам
      await Promise.all(promises3);
      return thing;
    },
  };
  return addThing;
};

export default composeThingAddMutation;
