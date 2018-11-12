import { locales } from '../../../appConfig';
import isArray from '../is/isArray';
import isObject from '../is/isObject';

//  функция формирует объект получающий на входе thingConfig или ...
// ... attribues of subDoucument и возвращающая в качестве результата ...
// ... объект содержащий значения, на всю глубину иерархии.
// в качестве необязательного воходного параметра также могут быть значения ...
// полей-справочников получаемых из строки браузера
const composeDefaultValue = (thingConfigOrAttributes, paramsFromQuery = {}) => {
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    paramFields,
    specialFields,
    subDocumentFields,
    subDocumentName,
    textFields,
  } = thingConfigOrAttributes;

  const result = {};

  // если обрабатываем subDoucument то присваивается id ...
  // ... чтобы использовать этот id в массивах subDoucument'ов
  if (subDocumentName) {
    result.id = Math.random()
      .toString(16)
      .slice(2);
  }

  // добавляем многоязычне поля в словарь fields
  // eslint-disable-next-line no-unused-expressions
  const defaultI18nValues = locales.reduce((prev, locale) => {
    // eslint-disable-next-line no-param-reassign
    prev[locale] = '';
    return prev;
  }, {});

  // добавляем значения по умолчанию для booleanFields
  // eslint-disable-next-line no-unused-expressions
  booleanFields &&
    booleanFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = defaultValue === undefined ? false : defaultValue;
      return prev;
    }, result);

  // добавляем значения по умолчанию для dateFields
  // eslint-disable-next-line no-unused-expressions
  dateFields &&
    dateFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = defaultValue;
      return prev;
    }, result);

  // добавляем значения по умолчанию для i18nFields
  // eslint-disable-next-line no-unused-expressions
  i18nFields &&
    i18nFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = defaultValue
        ? { ...defaultValue }
        : { ...defaultI18nValues };
      return prev;
    }, result);

  // добавляем значения по умолчанию для numberFields
  // eslint-disable-next-line no-unused-expressions
  numberFields &&
    numberFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = defaultValue;
      return prev;
    }, result);

  // добавляем значения по умолчанию для paramFields
  // eslint-disable-next-line no-unused-expressions
  paramFields &&
    paramFields.reduce((prev, { multiple, name, default: defaultValue }) => {
      if (paramsFromQuery[name]) {
        // если было передано значение поля-справочника из строки браузера
        // eslint-disable-next-line no-param-reassign
        prev[name] = multiple ? [paramsFromQuery[name]] : paramsFromQuery[name];
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[name] = multiple ? defaultValue || [] : defaultValue;
      }
      return prev;
    }, result);

  // добавляем значения по умолчанию для textFields
  // eslint-disable-next-line no-unused-expressions
  textFields &&
    textFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = defaultValue === undefined ? '' : defaultValue;
      return prev;
    }, result);

  // добавляем значения по умолчанию для specialFields
  // eslint-disable-next-line no-unused-expressions
  specialFields &&
    specialFields.reduce((prev, { name, default: defaultValue }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] =
        isObject(defaultValue) || isArray(defaultValue)
          ? JSON.parse(JSON.stringify(defaultValue)) // клонируем объект
          : defaultValue;
      return prev;
    }, result);

  // добавляем значения в поля содержащиеся в subDocumentFields
  // eslint-disable-next-line no-unused-expressions
  subDocumentFields &&
    subDocumentFields.reduce((prev, { name, attributes, array }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = array
        ? []
        : composeDefaultValue(attributes, paramsFromQuery);
      return prev;
    }, result);

  return result;
};

export default composeDefaultValue;
