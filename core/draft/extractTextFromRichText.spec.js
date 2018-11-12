/* eslint-env jest */

import extractTextFromRichText from './extractTextFromRichText';

describe('extractTextFromRichText draft util', () => {
  const ukRichTextObj = {
    entityMap: {},
    blocks: [
      { text: 'Контент українською' },
      { text: 'строка 2' },
      { text: 'строка 3' },
    ],
  };
  const ruRichTextObj = {
    entityMap: {},
    blocks: [
      { text: 'Контент по русски' },
      { text: 'строка 2' },
      { text: 'строка 3' },
    ],
  };
  const enRichTextObj = {
    entityMap: {},
    blocks: [
      { text: 'Content in English' },
      { text: 'line 2' },
      { text: 'line 3' },
    ],
  };
  const expectedResult = 'Контент українською\nстрока 2\nстрока 3';

  test('should return object from unpaked richTextField', () => {
    const richTextField = {
      uk: ukRichTextObj,
      ru: ruRichTextObj,
      en: enRichTextObj,
    };
    const result = extractTextFromRichText(richTextField, 'uk');
    expect(result).toEqual(expectedResult);
  });
  test('should return object from stringified richTextField', () => {
    const richTextField = {
      uk: JSON.stringify(ukRichTextObj),
      ru: JSON.stringify(ruRichTextObj),
      en: JSON.stringify(enRichTextObj),
    };
    const result = extractTextFromRichText(richTextField, 'uk');
    expect(result).toEqual(expectedResult);
  });
});
