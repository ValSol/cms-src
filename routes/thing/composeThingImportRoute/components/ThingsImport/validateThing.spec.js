/* eslint-env jest */

import validateThing from './validateThing';

describe('validating Thing object', () => {
  const thing = {
    // specialFields
    slug: 'abc',
    pictures: [],
    // i18nFields
    title: {
      uk: 'укр довгий заголовок',
      ru: 'рус длинный заголовок',
      en: 'eng long title',
    },
    shortTitle: {
      uk: 'укр заголовок',
      ru: 'рус заголовок',
      en: 'eng title',
    },
    content: {
      uk: 'укр контент',
      ru: 'рус контент',
      en: 'eng content',
    },
    subject: ['patent'],
    section: 'info',
  };
  const appConfig = {
    locales: ['uk', 'ru', 'en'],
    params: {
      section: ['info', 'services'],
      subject: ['trademark', 'copyright', 'patent', 'design'],
    },
  };
  const thingConfig = {
    // specialFields
    specialFields: [
      {
        // хранит уникальный идентификатор использующийся в адресной строке браузера
        name: 'slug',
        required: false,
        default: '', // для текстовых полей если required = false - указываеть по умолчанию
      },
      {
        // коллекция картинок
        name: 'pictures',
        required: false,
        default: [], // используем в thingAddRoute роуте и утилите getDeletedThing
        type: '[PictureInputType]',
      },
    ],
    booleanFields: [],
    textFields: [],
    dateFields: [],
    numberFields: [],
    i18nFields: [
      {
        name: 'title',
        required: true,
      },
      {
        name: 'shortTitle',
        required: true,
      },
      {
        name: 'content',
        required: true,
      },
    ],
    paramFields: [
      {
        name: 'subject',
        multiple: true,
        required: true,
      },
      {
        name: 'section',
        multiple: false,
        required: true,
      },
    ],
  };
  test('should validate right thing', () => {
    const result = validateThing({}, thingConfig, appConfig);
    const expectedResult = {
      title: 'RequiredField',
      shortTitle: 'RequiredField',
      content: 'RequiredField',
      subject: 'RequiredField',
      section: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with wrong i18n fields', () => {
    const thing2 = {
      title: 'title',
      shortTitle: 'shortTitle',
      content: 'content',
    };
    const result = validateThing(thing2, thingConfig, appConfig);
    const expectedResult = {
      title: 'InvalidI18nField',
      shortTitle: 'InvalidI18nField',
      content: 'InvalidI18nField',
      subject: 'RequiredField',
      section: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with wrong param fields', () => {
    const thing2 = {
      subject: ['patent2'],
      section: 'info2',
    };
    const result = validateThing(thing2, thingConfig, appConfig);
    const expectedResult = {
      title: 'RequiredField',
      shortTitle: 'RequiredField',
      content: 'RequiredField',
      subject: 'InvalidParamField',
      section: 'InvalidParamField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with wrong param fields', () => {
    const thing2 = {
      subject: ['patent2'],
      section: 'info2',
    };
    const result = validateThing(thing2, thingConfig, appConfig);
    const expectedResult = {
      title: 'RequiredField',
      shortTitle: 'RequiredField',
      content: 'RequiredField',
      subject: 'InvalidParamField',
      section: 'InvalidParamField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with undefined required boolean field', () => {
    const thingConfig2 = {
      ...thingConfig,
      booleanFields: [
        {
          name: 'pubulished',
          required: true,
        },
      ],
    };
    const result = validateThing(thing, thingConfig2, appConfig);
    const expectedResult = {
      pubulished: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with invalid boolean field', () => {
    const thingConfig2 = {
      ...thingConfig,
      booleanFields: [
        {
          name: 'pubulished',
          required: true,
        },
      ],
    };
    const thing2 = {
      ...thing,
      pubulished: 'Yes',
    };
    const result = validateThing(thing2, thingConfig2, appConfig);
    const expectedResult = { pubulished: 'InvalidBooleanField' };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with false boolean field', () => {
    const thingConfig2 = {
      ...thingConfig,
      booleanFields: [
        {
          name: 'pubulished',
          required: true,
        },
      ],
    };
    const thing2 = {
      ...thing,
      pubulished: false,
    };
    const result = validateThing(thing2, thingConfig2, appConfig);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with invalid text field', () => {
    const thingConfig2 = {
      ...thingConfig,
      textFields: [
        {
          name: 'phone',
          required: true,
        },
      ],
    };
    const thing2 = {
      ...thing,
      phone: 380632331199,
    };
    const result = validateThing(thing2, thingConfig2, appConfig);
    const expectedResult = { phone: 'InvalidTextField' };
    expect(result).toEqual(expectedResult);
  });
  test('should validate thing with invalid number field', () => {
    const thingConfig2 = {
      ...thingConfig,
      numberFields: [
        {
          name: 'stars',
          required: true,
        },
      ],
    };
    const thing2 = {
      ...thing,
      stars: 'five',
    };
    const result = validateThing(thing2, thingConfig2, appConfig);
    const expectedResult = { stars: 'InvalidNumberField' };
    expect(result).toEqual(expectedResult);
  });
  test('should validate right thing', () => {
    const result = validateThing(thing, thingConfig, appConfig);
    expect(result).toEqual({});
  });
});
