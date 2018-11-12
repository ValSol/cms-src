/* eslint-env jest */
import { getThingConfig, thingNames } from '../appConfig';

// вспомогательная функция для сбора названий subDocument'ов
const collectSubDocumentsNames = (
  currentAttributes,
  currentArray,
  subDocumentMessages,
) => {
  const { messages, subDocumentFields, subDocumentName } = currentAttributes;
  if (currentArray && !subDocumentMessages[subDocumentName]) {
    // eslint-disable-next-line no-param-reassign
    subDocumentMessages[subDocumentName] = messages;
  }
  subDocumentFields.forEach(({ attributes, array }) =>
    collectSubDocumentsNames(attributes, array, subDocumentMessages),
  );
};

describe('appConfig SubDocuments Messages', () => {
  // собираем все имена и сообщения subDocument'ов в один справочинк
  const subDocumentMessages = {};
  thingNames.forEach(nameOfThing => {
    const { subDocumentFields } = getThingConfig(nameOfThing);
    subDocumentFields.forEach(({ attributes, array }) =>
      collectSubDocumentsNames(attributes, array, subDocumentMessages),
    );
  });
  const reg = /^[A-Z][A-Za-z0-9]*$/;
  Object.keys(subDocumentMessages).forEach(subDocumentName => {
    // проверяем что subDocumentName составлен из правильных символов
    expect(reg.test(subDocumentName)).toBe(true);
    // проверяем что subDocumentName не являются запрещенным
    ['Param', 'Params', 'Thing', 'User'].forEach(thingName => {
      expect(thingNames.includes(thingName)).toBe(false);
    });
  });

  // проверям наличие всех сообщений
  Object.keys(subDocumentMessages).forEach(subDocumentName => {
    test(`should have right number of messages of subDocument "${subDocumentName}"`, () => {
      expect(Object.keys(subDocumentMessages[subDocumentName]).length).toBe(3);
    });
    test(`should have right messages of subDocument "${subDocumentName}"`, () => {
      const messages = subDocumentMessages[subDocumentName];
      expect(messages[`New${subDocumentName}`].id).toBe(
        `${subDocumentName}.New${subDocumentName}`,
      );
      expect(messages[`AddNew${subDocumentName}`].id).toBe(
        `${subDocumentName}.AddNew${subDocumentName}`,
      );
      expect(messages[`Remove${subDocumentName}`].id).toBe(
        `${subDocumentName}.Remove${subDocumentName}`,
      );
    });
  });
});
