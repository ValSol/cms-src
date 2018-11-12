/* eslint-env jest */
import { getThingConfig, thingNames } from '../appConfig';
import { fieldNamesMessages as messages } from '../appConfig/messages';

// вспомогательная функция для сбора названий полей в subDocument'ах
const collectFieldNames = (attributes, fieldNames) => {
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    // paramFields,
    specialFields,
    subDocumentFields,
    subDocumentName,
    textFields,
  } = attributes;
  // eslint-disable-next-line no-param-reassign
  fieldNames[subDocumentName] = [];
  [
    ...booleanFields,
    ...dateFields,
    ...i18nFields,
    ...numberFields,
    // paramFields,
    ...specialFields,
    ...subDocumentFields,
    ...textFields,
  ].reduce((prev, { name }) => {
    if (!prev.includes(name)) prev.push(name);
    return prev;
  }, fieldNames[subDocumentName]);
};

describe('appConfig Field Messages', () => {
  const thingFieldNames = [];
  const subDocumentFieldNames = {};
  thingNames.forEach(nameOfThing => {
    const thingConfig = getThingConfig(nameOfThing);
    const {
      booleanFields,
      dateFields,
      i18nFields,
      numberFields,
      // paramFields,
      specialFields,
      subDocumentFields,
      textFields,
    } = thingConfig;
    // получаем всех названия полей из всех Things
    [
      ...booleanFields,
      ...dateFields,
      ...i18nFields,
      ...numberFields,
      // paramFields,
      ...specialFields,
      ...subDocumentFields,
      ...textFields,
    ].reduce((prev, { name }) => {
      if (!prev.includes(name)) prev.push(name);
      return prev;
    }, thingFieldNames);

    // получаем все поля в subDocument'ах
    subDocumentFields.forEach(({ attributes }) => {
      collectFieldNames(attributes, subDocumentFieldNames);
    });
  });
  test('should have right thing field messages', () => {
    thingFieldNames.forEach(name => {
      expect(messages[name].id).toBe(`FieldNames.${name}`);
    });
  });
  test('should have right subDocument field messages', () => {
    Object.keys(subDocumentFieldNames).forEach(key =>
      subDocumentFieldNames[key].forEach(name => {
        expect(messages[`${name}Of${key}`].id).toBe(
          `FieldNames.${name}Of${key}`,
        );
      }),
    );
  });
});
