import Promise from 'bluebird';

import { locales, thingNames } from '../../appConfig';
import {
  composeExcerptsFromThings,
  composeTextIndexFields,
  hasRichTextFields,
} from '../../core/utils';
import { getThingModel } from '../mongooseModels';
import getThingCollectionsFromDb from './getThingCollectionsFromDb';
import compareThings from './compareThings';
import compareTextIndexes from './compareTextIndexes';
import compareExcerpts from './compareExcerpts';
import getLinksFromFields from './getLinksFromFields';

const resolveThingsStatus = async (
  thingConfig,
  optionalThings,
  optionalExcerpts,
) => {
  const { thingName } = thingConfig;
  // выполняем запросы к БД и получаем коллекции для данной thingName из БД
  const {
    excerptsFromDb,
    textIndexesByLocalesFromDb,
    thingsFromDb,
  } = await getThingCollectionsFromDb(thingConfig);

  const things = optionalThings || [];
  const excerpts = optionalExcerpts || [];
  // -----------------------------------------------------------------------
  // отрабатываем things
  const {
    insert: insertThings,
    update: updateThings,
    allThings,
    newAndUpdatedThings,
  } = compareThings(thingsFromDb, things);
  const result = { newAndUpdatedThings, textIndexes: {} };
  result.things = { insert: insertThings, update: updateThings, remove: [] };
  // -----------------------------------------------------------------------
  // отрабатываем text indexes
  locales.forEach((locale, i) => {
    // формируем гарантировано ПРАВИЛЬНЫЕ текстовые индексы
    const composedTextIndexes = allThings.map(thing =>
      composeTextIndexFields(thing, locale, thingConfig),
    );
    // сравниваем индексы из БД с правильными индексами
    const { insert, update, remove } = compareTextIndexes(
      textIndexesByLocalesFromDb[i],
      composedTextIndexes,
      thingConfig,
    );
    result.textIndexes[locale] = { insert, update, remove };
  });

  // -----------------------------------------------------------------------
  // отрабатываем backlinks
  // формируем гарантировано ПРАВИЛЬНЫЕ вектора определяющие ссылки  ...
  // ... и, соответственно, backLinks
  // вектор представляет из себя объект содержащий начало и конец ссылки
  // { item, itemThingName, _id, thingName }
  if (hasRichTextFields(thingConfig)) {
    // выполняем только если текущий тип thing имеет ricthText поля
    const composedLinkVectors = allThings
      .map(thing => {
        const links = getLinksFromFields(thing, thingConfig);
        links.forEach(link => {
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          link.item = thing._id;
          // eslint-disable-next-line no-param-reassign
          link.itemThingName = thingName;
        });
        return links;
      })
      .reduce((prev, links) => prev.concat(links), [])
      .reduce((prev, vector) => {
        const { item, _id } = vector;
        // eslint-disable-next-line no-param-reassign
        prev[`${item}:${_id}`] = vector;
        return prev;
      }, {});

    // получаем все backLinks из всех существующих коллекций things
    // в которых присутствуют ссылки ИЗ объектов с текущим thingName
    const promises = thingNames.map(name => getThingModel(name));
    const Things = await Promise.all(promises);
    const promises2 = Things.map(Thing =>
      Thing.find({ 'backLinks.itemThingName': thingName }, { backLinks: 1 }),
    );
    const allBackLinks = await Promise.all(promises2);
    // формируем словарь векторов ссылок хранящихся сейчас в БД
    const linkVectorsFromDB = thingNames.reduce((prev, name, i) => {
      allBackLinks[i].forEach(({ _id, backLinks }) => {
        backLinks.forEach(({ item, itemThingName }) => {
          if (itemThingName === thingName) {
            // eslint-disable-next-line no-param-reassign
            prev[`${item}:${_id}`] = {
              item,
              itemThingName,
              _id,
              thingName: thingNames[i],
            };
          }
        });
      });
      return prev;
    }, {});

    const vectorsToAdd = Object.keys(composedLinkVectors).reduce(
      (prev, key) => {
        if (linkVectorsFromDB[key] === undefined) {
          prev.push(composedLinkVectors[key]);
        }
        return prev;
      },
      [],
    );

    const vectorsToRemove = Object.keys(linkVectorsFromDB).reduce(
      (prev, key) => {
        if (composedLinkVectors[key] === undefined) {
          prev.push(linkVectorsFromDB[key]);
        }
        return prev;
      },
      [],
    );

    // подготавливаем справочинк в который разложим аргументы пакетного запроса ...
    // ... по thingName получателя ссылки
    const linksByThings = thingNames.reduce((prev, name) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = [];
      return prev;
    }, {});
    // готовим аргументы пакетного запроса обнолвения backLinks
    vectorsToAdd.forEach(({ _id, item, thingName: thingName2 }) =>
      linksByThings[thingName2].push({
        _id,
        $addToSet: { backLinks: { item, itemThingName: thingName } },
      }),
    );
    // готовим аргументы пакетного запроса обновления backLinks
    vectorsToRemove.forEach(({ _id, item, thingName: thingName2 }) =>
      linksByThings[thingName2].push({
        _id,
        $pull: { backLinks: { item, itemThingName: thingName } },
      }),
    );

    result.backLinks = linksByThings;
  }

  // -----------------------------------------------------------------------
  // отрабатываем excerpts
  const composedExcerpts = composeExcerptsFromThings(allThings, thingConfig);
  const { insert, update, remove } = compareExcerpts(
    excerptsFromDb,
    composedExcerpts,
    excerpts, // импортрируемые выборки (если были указаны)
  );

  result.excerpts = { insert, update, remove };

  // -----------------------------------------------------------------------
  return result;
};

export default resolveThingsStatus;
