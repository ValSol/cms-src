import Promise from 'bluebird';

// функция получает значения коллекций задающих thing

import { locales } from '../../appConfig';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../mongooseModels';

const getThingCollectionsFromDb = async thingConfig => {
  const { thingName } = thingConfig;

  // из БД получаем:
  const promises1 = [];
  //  1) все things
  const Thing = await getThingModel(thingName);
  promises1.push(Thing.find());
  // 2) все excerpts
  const Excerpt = await getExcerptModel(thingName);
  promises1.push(Excerpt.find());
  // 3) все textIndexes в каждой из locales
  const promises = locales.map(locale => getTextIndex(thingName, locale));
  const TextIndexes = await Promise.all(promises);
  const promises2 = locales.map((locale, i) => TextIndexes[i].find());

  const promises3 = [...promises1, ...promises2];
  // выполняем запросы и получаем их результаты
  const [things, excerpts, ...textIndexesByLocales] = await Promise.all(
    promises3,
  );

  const thingsFromDb = things.map(thing => {
    const thing2 = thing.toObject();
    // чтобы не было проблем со: сравнениями / flat / unflatten
    // _id сразу переводим в текст
    // eslint-disable-next-line no-underscore-dangle
    thing2._id = thing2._id.toString();
    return thing2;
  });
  const excerptsFromDb = excerpts.map(excerpt => excerpt.toObject());
  const textIndexesByLocalesFromDb = textIndexesByLocales.map(textIndexes =>
    textIndexes.map(textIndex => textIndex.toObject()),
  );
  return { thingsFromDb, excerptsFromDb, textIndexesByLocalesFromDb };
};

export default getThingCollectionsFromDb;
