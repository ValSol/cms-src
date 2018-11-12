import mongoose from 'mongoose';

import connectionProvider from './connectionProvider';
import { getThingConfig, mongoLanguages } from '../../appConfig';
import { serverSettings } from '../../config';

const { Schema } = mongoose;

// в модулю задается функци getTextIndex которая в зависимотси от
// thingName, locale инициирует и/или подключает соовтетствующую коллекцию
// предназначенную для хранения предназначенных для текстового индексирования
// полей определенного языка, определенного Item (то есть Article, User и т.п.)

// здесь храним ссылки на уже сгенерированные схемы
const textIndexSchemas = {};

const createTextIndexSchema = (thingName, locale) => {
  const { textIndexFields } = getThingConfig(thingName);
  // генерируем поля используемые для интернационализации
  const textIndexFieldsObject = {};
  textIndexFields.forEach(({ name }) => {
    textIndexFieldsObject[name] = {
      type: String,
      required: true,
    };
  });

  const TextIndexSchema = new Schema(
    {
      ...textIndexFieldsObject,
      _item: {
        type: Schema.Types.ObjectId,
        ref: thingName,
      },
      // задает использование createdAt и updatedAt в качестве полей с timestamp'ом
      // эти поля будем использовать при проверке целостности БД (равенства
      // проиндексированных полей, полям соответствующего Item)
    },
    { timestamps: true },
  );

  // готовим текстовый индекс для всех используемых языков
  const textIndexArgs = {};
  const weights = {};
  textIndexFields.forEach(({ name, weight }) => {
    textIndexArgs[name] = 'text';
    weights[name] = weight;
  });
  TextIndexSchema.index(textIndexArgs, {
    name: `${thingName}_${locale}_TextIndex`,
    default_language: mongoLanguages[locale],
    weights,
  });

  // добавил чтобы в Excerpt работала динамическ подгрузка для Article
  // mongoose.model(`${locale}_${thingName}`, TextIndexSchema);
  // дополняем кеш уже заданных коллекций с индексами
  textIndexSchemas[`${thingName}:${locale}`] = TextIndexSchema;

  return TextIndexSchema;
};

// по умолчанию экспортируем функцию getTextIndex
export default async (thingName, locale) => {
  const textIndexSchema =
    textIndexSchemas[`${thingName}:${locale}`] ||
    createTextIndexSchema(thingName, locale);

  // в дальнейшем здесь можно было бы сделать проверку process.env переменной
  // и в завивсимости от значений определенных переменных окружения использовать
  // различные serverSettings и, следовательно, подключать разные БД,
  // например, для случая тестирования
  const { serverUrl, database } = serverSettings;

  try {
    const conn = await connectionProvider(serverUrl, database);
    return conn.model(`${thingName}_${locale}_index`, textIndexSchema);
  } catch (err) {
    throw err;
  }
};
