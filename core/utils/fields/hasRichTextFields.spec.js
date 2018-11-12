/* eslint-env jest */
import hasRichTextFields from './hasRichTextFields';

describe('hasRichTextFields', () => {
  test('should return false', () => {
    const thingConfig = {};
    const expectedResult = false;
    const result = hasRichTextFields(thingConfig);
    expect(result).toBe(expectedResult);
  });
  test('should return false 2', () => {
    const thingConfig = {
      richTextFields: [],
      subDocumentFields: [],
    };
    const expectedResult = false;
    const result = hasRichTextFields(thingConfig);
    expect(result).toBe(expectedResult);
  });
  test('should return true', () => {
    const thingConfig = {
      richTextFields: ['content'],
      subDocumentFields: [],
    };
    const expectedResult = true;
    const result = hasRichTextFields(thingConfig);
    expect(result).toBe(expectedResult);
  });
  test('should return true', () => {
    const thingConfig = {
      subDocumentFields: [
        {
          attributes: {
            subDocumentFields: [
              {
                attributes: {
                  richTextFields: ['content'],
                },
              },
            ],
          },
        },
      ],
    };
    const expectedResult = true;
    const result = hasRichTextFields(thingConfig);
    expect(result).toBe(expectedResult);
  });
});
