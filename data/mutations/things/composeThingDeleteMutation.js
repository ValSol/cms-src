import Promise from 'bluebird';
import mongoose from 'mongoose';
import { GraphQLID } from 'graphql/type';

import { getThingConfig, locales } from '../../../appConfig';
import { composeExcerptFields } from '../../../core/utils';
import rbac from '../../../core/rbac';
import {
  composeFieldsForThingOrSubDocument,
  getLinksFromFields,
} from '../../utils';
import { composeThingType } from '../../types';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../mongooseModels';

const composeThingDeleteMutation = thingName => {
  const input = false;
  const consideringRequired = true;
  const ThingType = composeThingType(thingName, input, consideringRequired);
  const thingConfig = getThingConfig(thingName);

  // задаем возможные аргументы
  const input2 = true;
  const consideringRequired2 = true;
  // вместо всего thingConfig передаем только поля необоходимые ...
  // ... для определения backLinks
  const { i18nFields, subDocumentFields } = thingConfig;
  const mutationArgs = {
    _id: { type: GraphQLID },
    ...composeFieldsForThingOrSubDocument(
      { i18nFields, subDocumentFields }, // вместо всего thingConfig
      input2,
      consideringRequired2,
    ),
  };

  const deleteThing = {
    type: ThingType,
    description: 'Delete the Thing',
    args: mutationArgs,
    async resolve(parentValue, args) {
      const { request: { user } } = parentValue;

      // если у пользователя нет прав на удаления thing - выходим
      if (!rbac.can(`${thingName}:delete`, { user })) return null;

      // извлекаем из общего словаря полей информацию о ссылках
      const linksToRemove = getLinksFromFields(args, thingConfig);

      const Thing = await getThingModel(thingName);
      // удаляем thing из БД и одновременно получаем все его поля в переменную thing
      const { _id } = args;
      const thing = await Thing.findById(_id);
      const { backLinks } = thing;
      if (backLinks.length) {
        throw new TypeError(
          `Attempt to remove the thing to which there are back links!`,
        );
      }
      thing.remove();

      // далее обновляем (удаляем) документы во вспомогательных коллекциях
      // сохранящие порядок размещения документов и индексы по каждому из языков
      const promises3 = [];

      // подготавливаем запросы на удаление данных о thing
      // из соответсвующей выборки
      const Excerpt = await getExcerptModel(thingName);
      // формируем запрос к базе данных для каждого возможного набора параметров
      const excerptFields = composeExcerptFields(thingConfig, thing);
      excerptFields.forEach(query => {
        // сохраняем сформированный запрос в массиве promises3
        promises3.push(
          Excerpt.findOneAndUpdate(query, { $pull: { items: _id } }),
        );
      });

      // для каждого языка из локали в сответствующих коллекциях
      // подготовливаем удаление соответствующего документа с текстовым индексом
      const promises = locales.map(locale => getTextIndex(thingName, locale));
      const TextIndexes = await Promise.all(promises);
      locales.forEach((locale, i) => {
        // получаем очередную коллекцию
        const TextIndex = TextIndexes[i];
        promises3.push(
          // похоже на то, что если промис добавляем внутри асинхронной функции
          // то для его отработки внутри массива промисов нужно вызвать ...
          // ... .then(() => {})
          TextIndex.findOneAndRemove({ _item: _id }).then(() => {}),
        );
      });

      // подготавливаем обновление полей backlinks во всех thing-объектах ...
      // ... на которые имеются ссылки в только что созданном thing-объекте
      const thingNames = linksToRemove.reduce(
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

      const pull = {
        $pull: { backLinks: { item: mongoose.Types.ObjectId(_id) } },
      };
      linksToRemove.forEach(({ _id: id, thingName: name }) => {
        promises3.push(
          ThingsDict[name].collection.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            pull,
          ),
        );
      });

      // запускаем на выполнение ВСЕ запросы к БД, сорхраненные в promises3
      // и получаем массив результаты запросов
      const resultOfQueries = await Promise.all(promises3);

      // выделяем только запросы к коллекции excerpt
      const resultOfQueriesToExcerpt = resultOfQueries.slice(
        0,
        excerptFields.length,
      );

      const promises4 = [];
      resultOfQueriesToExcerpt.forEach(result => {
        const { items, _id: excerptId } = result;
        if (items.length < 2) {
          // сохраняем в массиве promises4 очередной запрос ...
          // ... на удаление документа с пустым массивом
          promises4.push(Excerpt.findByIdAndRemove(excerptId));
        }
      });

      // собственно удаляем документы c пустыми массивами
      await Promise.all(promises4);

      return thing;
    },
  };

  return deleteThing;
};

export default composeThingDeleteMutation;
