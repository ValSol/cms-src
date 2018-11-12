import mongoose from 'mongoose';

import connectionProvider from './connectionProvider';
import { serverSettings } from '../../config';
import { getThingConfig, params } from '../../appConfig';

const { Schema } = mongoose;

const excerptSchemas = {};

// генерируем модель исходя из ее названия и соовтетсвующего ...
// ... набора свойств хранящихся в appConfig/${thingName}
const createExcerptSchema = thingName => {
  // получаем конфигурацию исходя из которой и создается модель
  // причем не только с данным для клиента но и для сервера
  const thingConfig = getThingConfig(thingName);
  const { orderedSets } = thingConfig;

  const fields = {
    paramNames: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: thingName,
      },
    ],
  };

  // задаем поля соответствующие используемым параметрам
  orderedSets.forEach(set => {
    set.reduce((prev, paramName) => {
      // eslint-disable-next-line no-param-reassign
      prev[paramName] = {
        type: String,
        enum: params[paramName],
      };
      return prev;
    }, fields);
  });

  const ExcerptSchema = new Schema(fields, { timestamps: true });

  // задаем составные индексы на группы используемых параметров
  orderedSets.forEach(set => {
    const setIndex = set.reduce((prev, paramName) => {
      // eslint-disable-next-line no-param-reassign
      prev[paramName] = 1;
      return prev;
    }, {});
    ExcerptSchema.index(setIndex, { unique: true });
  });

  // дополняем кеш уже заданных коллекций с индексами
  excerptSchemas[thingName] = ExcerptSchema;

  return ExcerptSchema;
};

// по умолчанию экспортируем функцию getExcerptModel
export default async thingName => {
  const excerptSchema =
    excerptSchemas[thingName] || createExcerptSchema(thingName);

  // в дальнейшем здесь можно было бы сделать проверку process.env переменной
  // и в завивсимости от значений определенных переменных окружения использовать
  // различные serverSettings и, следовательно, подключать разные БД,
  // например, для случая тестирования
  const { serverUrl, database } = serverSettings;

  try {
    const conn = await connectionProvider(serverUrl, database);
    return conn.model(`${thingName}_excerpt`, excerptSchema);
  } catch (err) {
    throw err;
  }
};
