import * as appConfig from '../../../../../appConfig';
import { isBool, isNumber, isString } from '../../../../../core/utils';

const validateThing = (thing, thingConfig, appConf = appConfig) => {
  const { locales, params } = appConf;
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    textFields,
  } = thingConfig;
  const errors = {};
  // ---------------------------------------------------------------------------
  // тестируем наличие обязательных полей
  [
    ...booleanFields,
    ...dateFields,
    ...i18nFields,
    ...numberFields,
    ...paramFields,
    ...specialFields,
    ...textFields,
  ].reduce((prev, { name, required }) => {
    // если _id не указан, то есть создается новая thing -> обязательные поля
    // должны быть ОБЯЗАТЕЛЬНО
    // eslint-disable-next-line no-underscore-dangle
    if (!thing._id && required && thing[name] === undefined) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'RequiredField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  // тестируем правильность i18nFields
  i18nFields.reduce((prev, { name }) => {
    if (
      thing[name] &&
      !Object.keys(thing[name]).every(
        key => locales.includes(key) && isString(thing[name][key]),
      )
    ) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'InvalidI18nField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  // тестируем правильность значений полей-справочников
  paramFields.reduce((prev, { name, multiple }) => {
    if (multiple) {
      if (
        thing[name] &&
        thing[name].some(paramValue => !params[name].includes(paramValue))
      ) {
        // eslint-disable-next-line no-param-reassign
        prev[name] = 'InvalidParamField';
      }
    } else if (thing[name] && !params[name].includes(thing[name])) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'InvalidParamField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  // тестируем правильность значений логических полей
  booleanFields.reduce((prev, { name }) => {
    if (thing[name] && !isBool(thing[name])) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'InvalidBooleanField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  // тестируем правильность значений  текстовых полей
  textFields.reduce((prev, { name }) => {
    if (thing[name] && !isString(thing[name])) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'InvalidTextField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  // тестируем правильность значений  числовых полей
  numberFields.reduce((prev, { name }) => {
    if (thing[name] && !isNumber(thing[name])) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = 'InvalidNumberField';
    }
    return prev;
  }, errors);
  // ---------------------------------------------------------------------------
  return errors;
};

export default validateThing;
