import mongoose from 'mongoose';
import * as specialMongooseFieldDeclarations from './specialMongooseFieldDeclarations';

// утилита получает данные по свойства модели и возвращает
// объект содержащий свойства подготовленные для задания схемы
const { Schema } = mongoose;

const composeThingSchemaProperties = (appConfig, thingConfig) => {
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    subDocumentFields,
    textFields,
    thingName,
  } = thingConfig;
  const { locales, params } = appConfig;
  // генерируем поля используемые для интернационализации
  const i18nFieldsObject = {};
  i18nFields.forEach(({ default: defaultValue, name, required }) => {
    i18nFieldsObject[name] = {};
    locales.forEach(locale => {
      i18nFieldsObject[name][locale] = {
        default: defaultValue || '',
        type: String,
        required,
      };
    });
  });
  /*
  // генерируем поле updatedFieldsAt
  // закоментировал пока как не используемые что данные
  const updatedFieldsAt = specialFields.reduce(
    (prev, { name }) => ({
      ...prev,
      [name]: {
        type: Date,
        default: Date.now,
        required: true,
      },
    }),
    {},
  );
  paramFields.forEach(({ name }) => {
    updatedFieldsAt[name] = {
      type: Date,
      default: Date.now,
      required: true,
    };
  });
  i18nFields.forEach(({ name }) => {
    updatedFieldsAt[name] = {};
    locales.forEach(locale => {
      updatedFieldsAt[name][locale] = {
        type: Date,
        default: Date.now,
        required: true,
      };
    });
  });
  */

  // генерируем специальные поля
  const specialFieldsObject = specialFields.reduce(
    (prev, { default: defaultValue, name, required }) => ({
      ...prev,
      [name]: {
        ...specialMongooseFieldDeclarations[name],
        default: defaultValue,
        required,
      },
    }),
    {},
  );

  // генерируем поля c параметрами
  const paramsFieldsObject = paramFields.reduce(
    (prev, { default: defaultValue, multiple, name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type: multiple ? [String] : String,
        default: defaultValue || (multiple ? [] : defaultValue),
        // проверяется строковае значение на попдание в список допустимых значений
        // ИЛИ проверяется строковае значение КАЖДОГО элемента массива на ...
        // ... попдание в список допустимых значений
        enum: params[name],
        required,
      };
      return prev;
    },
    {},
  );

  // генерируем поля да / нет
  const booleanFieldsObject = booleanFields.reduce(
    (prev, { default: defaultValue, name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type: Boolean,
        default: defaultValue,
        required,
      };
      return prev;
    },
    {},
  );

  // генерируем логическое поле
  const dateFieldsObject = dateFields.reduce(
    (prev, { default: defaultValue, name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type: Date,
        default: defaultValue,
        required,
      };
      return prev;
    },
    {},
  );

  // генерируем числовое поля
  const numberFieldsObject = numberFields.reduce(
    (prev, { default: defaultValue, name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        type: Number,
        default: defaultValue,
        required,
      };
      return prev;
    },
    {},
  );

  // генерируем текстовые поля
  const textFieldsObject = textFields.reduce(
    (prev, { default: defaultValue, name, required }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {
        default: defaultValue,
        type: String,
        required,
      };
      return prev;
    },
    {},
  );

  // если внедренные документы (саб документы) определены
  const subDocumentFieldsObject = subDocumentFields.reduce(
    (prev, { name, array, attributes }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = array
        ? [composeThingSchemaProperties(appConfig, attributes)]
        : composeThingSchemaProperties(appConfig, attributes);
      return prev;
    },
    {},
  );

  const result = {
    ...booleanFieldsObject,
    ...dateFieldsObject,
    ...i18nFieldsObject,
    ...numberFieldsObject,
    ...paramsFieldsObject,
    ...specialFieldsObject,
    ...textFieldsObject,
    ...subDocumentFieldsObject,
    // updatedFieldsAt,
    // задает использование createdAt и updatedAt в качестве полей с timestamp'ом
  };

  if (thingName) {
    // в первом уровне задаем поле - список обратных ссылок на ...
    // ... документы в которых имеется ссылка на текущий документ
    result.backLinks = [
      {
        // используем itemThingName, а не просто "thingName" чтобы при ...
        // ... пакетном обновлении backLinks чтобы было удобно формировать ...
        // .... "вектора ссылок" { item, itemThingName, _id, thingName }, где ...
        // ... (item, itemThingName) - задает объект ИЗ которого ссылка
        // ... (_id, thingName) - задает объект НА который ссылка
        itemThingName: String,
        item: {
          type: Schema.Types.ObjectId,
          refPath: 'backLinks.itemThingName',
        },
        _id: false, // чтобы не дублировались при $addToSet уже существующей ссылки
      },
    ];
  } else {
    // в поддокументах задаем id чтобы удобно было поддокументы ...
    // ... перемещать / удалять / добавлять в интерфейсе пользователя
    result.id = {
      type: String,
      required: true,
    };
  }
  return result;
};

export default composeThingSchemaProperties;
