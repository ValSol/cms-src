import Promise from 'bluebird';
import mongoose from 'mongoose';
import flat from 'flat';

import { GraphQLID, GraphQLList, GraphQLNonNull } from 'graphql/type';

import { getThingConfig, locales } from '../../../appConfig';
import {
  compareExcerptLists,
  composeExcerptFields,
  composeTextIndexFields,
} from '../../../core/utils';
import rbac from '../../../core/rbac';
import {
  composeFieldsForThingOrSubDocument,
  getLinksForAddAndRemove,
} from '../../utils';
import { composeSubDocumentType, composeThingType } from '../../types';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../mongooseModels';

const composeThingUpdateMutation = thingName => {
  const input = false;
  const consideringRequired = true;
  const ThingType = composeThingType(thingName, input, consideringRequired);
  const input2 = true;
  const consideringRequired2 = false;
  const ThingInputType = composeThingType(
    thingName,
    input2,
    consideringRequired2,
  );
  const thingConfig = getThingConfig(thingName);
  const { paramFields, subDocumentFields, textIndexFields } = thingConfig;

  // задаем возможные аргументы
  const input3 = true;
  const consideringRequired3 = false;
  const mutationArgs = {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    ...composeFieldsForThingOrSubDocument(
      thingConfig,
      input3,
      consideringRequired3,
    ),
    initial: { type: ThingInputType },
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

  const updateThing = {
    type: ThingType,
    description: 'Update the Thing',
    args: mutationArgs,
    async resolve(parentValue, args) {
      const { request: { user } } = parentValue;

      // если у пользователя нет прав на редактирование thing - выходим
      if (!rbac.can(`${thingName}:update`, { user })) return null;

      const { _id, initial, ...args2 } = args;
      // используем пакет flat чтобы обновлять отдельные значения
      // в глубине иерарахии, он преобразует
      // title: { uk: 'Надобраніч' } => 'title.uk': 'Надобраніч'
      // используем опцию safe: true чтобы массивы НЕ преобразовывались
      const args3 = flat(args2, { safe: true });

      const Thing = await getThingModel(thingName);

      // проверяем изменялись ли поля-параметры
      // и формируем запрос для получения предыдущих значений параметров
      const projection = {};
      let paramFieldsChanged = false;
      paramFields.forEach(({ name }) => {
        projection[name] = 1;
        // если в аргументах присутствует параметр
        // значит он был изменен
        if (args[name] !== undefined) {
          paramFieldsChanged = true;
        }
        return false;
      });

      let prevParams;
      if (paramFieldsChanged) {
        prevParams = await Thing.findById(_id, projection);
        if (!prevParams)
          throw new TypeError(`Incorrect _id: "${_id}" for update!`);
        prevParams = prevParams.toObject();
      }

      // готовим информацию о моменте обновления данных по каждому измененному полю
      /* // пока что НЕ будем использовать чтобы НЕ перегружать код
      const datetime = new Date();
      Object.keys(args3).forEach(field => {
        args3[`updatedFieldsAt.${field}`] = datetime;
      });
      */

      // обновляем Thing
      await Thing.update({ _id }, { $set: args3 });
      const thing = await Thing.findById(_id);

      const promises3 = [];

      // -------------------------------------------------------------------------
      // если менялись параметры подготавливаем внесение изменений
      // в excerpt'ы которые включают данные параметры
      let forRemoveFromExcerpts = 0;
      let forAddToExcerpts = 0;
      const Excerpt = await getExcerptModel(thingName);
      if (paramFieldsChanged) {
        const nextParams = Object.keys(prevParams).reduce((prev, key) => {
          // eslint-disable-next-line no-param-reassign
          prev[key] = thing[key];
          return prev;
        }, {});

        // получаем все необходимые excerpts ...
        // ... для предыдущего состояния thing
        const prevExcerpts = composeExcerptFields(thingConfig, prevParams);
        // ... для нового состояния thing
        const nextExcerpts = composeExcerptFields(thingConfig, nextParams);

        // ... получаем query нужные для обновления excerpts
        const { forAdd, forRemove } = compareExcerptLists(
          prevExcerpts,
          nextExcerpts,
        );

        // готовим данные для обновелния данных о порядке отображения статей
        const upsert = {
          $addToSet: { items: _id },
        };

        const pull = {
          $pull: { items: _id },
        };

        forAdd.forEach(queryForUpsert => {
          // сохраняем сформированный запрос в массиве
          promises3.push(
            // сохраняем сформированный запрос на добавление _id в массиве
            Excerpt.findOneAndUpdate(queryForUpsert, upsert, {
              upsert: true,
            }),
          );
        });

        forRemove.forEach(queryForPull => {
          // сохраняем сформированный запрос на удаление _id в массиве
          promises3.push(Excerpt.findOneAndUpdate(queryForPull, pull));
        });
        // для использования за пределами локальной области видимости
        forAddToExcerpts = forAdd;
        forRemoveFromExcerpts = forRemove;
      }
      // для каждого возможного языка преоверяем необходимость обновлять поля
      // в соответствующем документе из соответствующей коллекции
      // и, при необходимости, осуществляем обновление

      // проверяем изменились ли индексируемые поля
      const textIndexFieldsChanged = textIndexFields.some(
        ({ name }) => args[name] !== undefined,
      );

      if (textIndexFieldsChanged) {
        const promises = locales.map(locale => getTextIndex(thingName, locale));
        const TextIndexes = await Promise.all(promises);
        locales.forEach((locale, i) => {
          // формируем аргументы для создания документа в коллекции
          const textIndexArgs = composeTextIndexFields(
            args,
            locale,
            thingConfig,
          );
          // если не пустой набор аргументов - подготоваливаме запрос к БД
          if (Object.keys(textIndexArgs)) {
            // получаем очередную коллекцию
            const TextIndex = TextIndexes[i];
            // eslint-disable-next-line no-underscore-dangle
            textIndexArgs._item = _id;
            const query = { _item: _id };
            // на случай если документ для такого индекса не был создан
            // создаем при обновлении (для этого: upsert: true )
            promises3.push(
              TextIndex.findOneAndUpdate(query, textIndexArgs, {
                upsert: true,
                // похоже на то, что если промис добавляем внутри асинхронной функции
                // то для его отработки внутри массива промисов нужно вызвать ...
                // ... .then(() => {})
              }).then(() => {}),
            );
          }
        });
      }

      // подготавливаем обновление полей backlinks во всех thing-объектах ...
      // ... на которые имеются ссылки в только что созданном thing-объекте
      const { linksToAdd, linksToRemove } = getLinksForAddAndRemove(
        initial,
        args2,
        thingConfig,
      );
      const thingNames = [...linksToAdd, ...linksToRemove].reduce(
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

      const upsert = {
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
            upsert,
          ),
        );
      });

      const pull = {
        $pull: { backLinks: { item: mongoose.Types.ObjectId(_id) } },
      };
      linksToRemove.forEach(({ _id: id, thingName: name }) => {
        // используем ThingsDict[name].collection.findOneAndUpdate то есть ...
        //  ... используем нативную функцию MongoDB вместо mongoosejs ...
        // ... чтобы предотвратить обновление поля updatedAt
        promises3.push(
          ThingsDict[name].collection.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            pull,
          ),
        );
      });

      if (promises3.length) {
        const resultOfQueries = await Promise.all(promises3);
        if (forRemoveFromExcerpts.length) {
          // если удалялись _id из выборок определяем надо ли удалять ...
          // ... выборки в которых не осталось ни одной ссылки на thing

          const resultOfQueriesForRemoveFromExcerpts = resultOfQueries.slice(
            forAddToExcerpts.length,
            forAddToExcerpts.length + forRemoveFromExcerpts.length,
          );
          const promises4 = [];
          resultOfQueriesForRemoveFromExcerpts.forEach(result => {
            const { items, _id: excerptId } = result;
            if (items.length < 2) {
              // сохраняем в массиве promises4 очередной запрос ...
              // ... на удаление документа с пустым массивом
              promises4.push(Excerpt.findByIdAndRemove(excerptId));
            }
          });
          // собственно удаляем документы c пустыми массивами
          await Promise.all(promises4);
        }
      }

      return thing;
    },
  };
  return updateThing;
};

export default composeThingUpdateMutation;
