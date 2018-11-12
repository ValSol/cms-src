import mongoose from 'mongoose';

import connectionProvider from './connectionProvider';
import { serverSettings } from '../../config';
import * as appConfig from '../../appConfig';
import composeThingSchemaProperties from './composeThingSchemaProperties';

const { Schema } = mongoose;

const thingSchemas = {};

// генерируем модель исходя из ее названия и соовтетсвующего ...
// ... набора свойств хранящихся в appConfig/${thingName}
const createThingSchema = thingName => {
  const { getThingConfig } = appConfig;
  // получаем конфигурацию исходя из которой и создается модель
  const thingConfig = getThingConfig(thingName);
  const { compoundIndexFieldSets } = thingConfig;

  const ThingSchema = new Schema(
    composeThingSchemaProperties(appConfig, thingConfig),
    { timestamps: true },
  );

  if (compoundIndexFieldSets.length) {
    compoundIndexFieldSets.forEach(set => {
      const indexArgs = set.reduce((prev, { name, order }) => {
        // eslint-disable-next-line no-param-reassign
        prev[name] = order;
        return prev;
      }, {});
      ThingSchema.index(indexArgs, { unique: true });
    });
  }

  // добавил чтобы в Excerpt работала динамическ подгрузка, например для Article
  mongoose.model(thingName, ThingSchema);
  // дополняем кеш уже заданных коллекций с индексами
  thingSchemas[thingName] = ThingSchema;

  return ThingSchema;
};

// по умолчанию экспортируем функцию getThingModel
export default async thingName => {
  const thingSchema = thingSchemas[thingName] || createThingSchema(thingName);

  // в дальнейшем здесь можно было бы сделать проверку process.env переменной
  // и в завивсимости от значений определенных переменных окружения использовать
  // различные serverSettings и, следовательно, подключать разные БД,
  // например, для случая тестирования
  const { serverUrl, database } = serverSettings;

  try {
    const conn = await connectionProvider(serverUrl, database);
    return conn.model(thingName, thingSchema);
  } catch (err) {
    throw err;
  }
};
