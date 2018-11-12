/* eslint-env jest */
import composeTextIndexFields from './composeTextIndexFields';

describe('extractTextFromRichText util', () => {
  const thingConfig = {
    textIndexFields: [
      {
        name: 'title',
        weight: 1024,
      },
      {
        name: 'content',
        weight: 512,
      },
    ],
    richTextFields: ['content'],
  };
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

  test('should return object with text index field for locale', () => {
    const subject = 'info';
    const section = 'patent';
    const slug = 'test';
    const content = {
      uk: JSON.stringify(ukRichTextObj),
      ru: JSON.stringify(ruRichTextObj),
      en: JSON.stringify(enRichTextObj),
    };
    const title = {
      uk: 'Заголовок українською',
      ru: 'Название по русски',
      en: 'Title in English',
    };
    const article = {
      subject,
      section,
      slug,
      title,
      content,
    };
    const result = composeTextIndexFields(article, 'uk', thingConfig);
    const expectedResult = {
      title: 'Заголовок українською',
      content: 'Контент українською\nстрока 2\nстрока 3',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return object with text index field for locale and _item field', () => {
    const subject = 'info';
    const section = 'patent';
    const slug = 'test';
    const content = {
      uk: JSON.stringify(ukRichTextObj),
      ru: JSON.stringify(ruRichTextObj),
      en: JSON.stringify(enRichTextObj),
    };
    const title = {
      uk: 'Заголовок українською',
      ru: 'Название по русски',
      en: 'Title in English',
    };
    const article = {
      _id: '5a6ed67bb9cc9613c0be746',
      subject,
      section,
      slug,
      title,
      content,
    };
    const result = composeTextIndexFields(article, 'uk', thingConfig);
    const expectedResult = {
      title: 'Заголовок українською',
      content: 'Контент українською\nстрока 2\nстрока 3',
      _item: '5a6ed67bb9cc9613c0be746',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return empty object for not used locale', () => {
    const subject = 'info';
    const section = 'patent';
    const slug = 'test';
    const content = {
      ru: JSON.stringify(ruRichTextObj),
      en: JSON.stringify(enRichTextObj),
    };
    const title = {
      ru: 'Название по русски',
      en: 'Title in English',
    };
    const article = {
      subject,
      section,
      slug,
      title,
      content,
    };
    const result = composeTextIndexFields(article, 'uk', thingConfig);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
});
