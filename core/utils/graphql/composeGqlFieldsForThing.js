import { locales } from '../../../appConfig';

// функция получает thingConfig и возвращает объект содержащий ...
// ... ВСЕ возможные поля для данной thing
/*
например, для thing Article будет возвращен следующий объект:
{
  subject: null,
  section: null,
  slug: null,
  title: {
    uk: null,
    ru: null,
    en: null,
  },
  content: {
    uk: null,
    ru: null,
    en: null,
  },
  shortTitle: {
    uk: null,
    ru: null,
    en: null,
  },
  pictures: {
    engaged: null,
    md5Hash: null,
    src: null,
    width: null,
    height: null,
    size: null,
    uploadedAt: null,
    initialName: null,
    caption: {
      uk: null,
      ru: null,
      en: null,
    },
  },
}
*/

// вспомогательная функция формирующая иерархию отображаемых полей
const composeGqlFieldsForThing = (thingConfig, fieldsObject = {}) => {
  // получаем все поля которые используются в Thing
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
  } = thingConfig;

  // eslint-disable-next-line no-param-reassign
  if (subDocumentName) fieldsObject.id = null;

  // eslint-disable-next-line no-unused-expressions
  booleanFields &&
    booleanFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = null;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  dateFields &&
    dateFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = null;
      return prev;
    }, fieldsObject);

  // формируем вспомогательный словарь языков
  const langs = locales.reduce(
    (prev, locale) => ({ ...prev, [locale]: null }),
    {},
  );

  // eslint-disable-next-line no-unused-expressions
  i18nFields &&
    i18nFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = langs;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  numberFields &&
    numberFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = null;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  paramFields &&
    paramFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = null;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  specialFields &&
    specialFields.reduce((prev, { name, fields }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = fields || null;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  textFields &&
    textFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = null;
      return prev;
    }, fieldsObject);

  // eslint-disable-next-line no-unused-expressions
  subDocumentFields &&
    subDocumentFields.reduce((prev, { name, attributes }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = composeGqlFieldsForThing(attributes, prev[name]);
      return prev;
    }, fieldsObject);

  return fieldsObject;
};

export default composeGqlFieldsForThing;
