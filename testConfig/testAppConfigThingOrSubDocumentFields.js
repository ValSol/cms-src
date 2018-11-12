/* eslint-env jest */
import { params } from '../appConfig';
import * as specialMongooseFieldDeclarations from '../data/mongooseModels/specialMongooseFieldDeclarations';
import * as specialFieldDeclarations from '../data/utils/specialFieldDeclarations';
import * as specialArgDeclarations from '../data/utils/specialArgDeclarations';

const testAppConfigThingOrSubDocumentFields = (
  thingConfig,
  notFirstLevel,
  isArray,
) => () => {
  const {
    booleanFields,
    dateFields,
    i18nFields,
    numberFields,
    orderOfTheFormFields,
    paramFields,
    permaLinkFields,
    richTextFields,
    specialFields,
    subDocumentFields,
    textFields,
    thingName,
  } = thingConfig;
  const i18nFieldNames = i18nFields.map(({ name }) => name);
  const paramFieldNames = paramFields.map(({ name }) => name);
  const specialFieldNames = specialFields.map(({ name }) => name);
  test('should have right specialFields', () => {
    specialFields.forEach(({ default: defaultValue, name, required }) => {
      expect(typeof name).toBe('string');
      // проверяем объявления в mongooseModels и graphql utils
      expect(specialMongooseFieldDeclarations[name].type).toBeDefined();
      expect(specialFieldDeclarations[name].type).toBeDefined();
      expect(specialArgDeclarations[name].type).toBeDefined();
      // проверяем наличие значения по умолчанию
      if (!required) {
        expect(defaultValue).toBeDefined();
      }
    });
  });
  test('may have "slug" and "pictures" special field only on first level', () => {
    if (notFirstLevel) {
      expect(specialFieldNames.includes('slug')).toBe(false);
      expect(specialFieldNames.includes('pictures')).toBe(false);
    }
    booleanFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have right booleanFields', () => {
    booleanFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have right textFields', () => {
    textFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have right dateFields', () => {
    dateFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have right numberFields', () => {
    numberFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have right i18nFields', () => {
    i18nFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
    });
  });
  test('should have title in i18nFields', () => {
    // title - обязательное поле для всех Things И subDocuments в видет массива
    if (!notFirstLevel || isArray) {
      expect(i18nFieldNames.includes('title')).toBe(true);
    }
  });
  test('should have right paramFields', () => {
    const paramNames = Object.keys(params);
    paramFields.forEach(({ name }) => {
      expect(typeof name).toBe('string');
      // имя поля должно соответствовать одному из ключей словаря 'pararms'
      expect(paramNames.includes(name)).toBe(true);
    });
  });
  test('should have right richTextFields', () => {
    // проверяем что в subDocument'ах нет richText полей
    if (notFirstLevel) {
      expect(richTextFields.length).toBe(0);
    }

    richTextFields.forEach(name => {
      expect(typeof name).toBe('string');
      // имя поля должно соответствовать одному из имен из 'i18n' полей
      expect(i18nFieldNames.includes(name)).toBe(true);
    });
    if (richTextFields.length) {
      // если присутствуют richTextFields то среди specialFields ...
      // ... должно присутствовать поле 'pictures'
      specialFields.map(({ name }) => name).includes('pictures');
    }
  });

  describe('should have right subDocumentFields', () => {
    subDocumentFields.forEach(({ array, attributes, name }) => {
      const { subDocumentName } = attributes;
      expect(typeof subDocumentName).toBe('string');
      describe(
        `Test fields of subDocument: "${subDocumentName}"`,
        // указываем неиспользование в качестве array для проверки наличия ...
        // ... поля 'title'
        testAppConfigThingOrSubDocumentFields(attributes, true, array),
      );
      expect(typeof name).toBe('string');
    });
  });

  test('should have unique field names that are asci', () => {
    // проверяем что все поля из всех групп полей обладают УНИКАЛЬНЫМИ именами
    // И что эти поля составлены из правленных символов
    const reg = /^[a-z][A-Za-z0-9]*$/;
    const allFields = [];
    booleanFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    textFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    dateFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    numberFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    i18nFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    paramFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    subDocumentFields.forEach(({ name }) => {
      expect(reg.test(name)).toBe(true);
      expect(allFields.includes(name)).toBe(false);
      allFields.push(name);
    });
    // теперь когда allFields содержит все имена полей кроме специальных
    // проверяем что среди этих полей НЕТ имен зарезервированных для специальных полей
    const specialFieldsNames = Object.keys(specialMongooseFieldDeclarations);
    specialFieldsNames.forEach(name => {
      expect(allFields.includes(name)).toBe(false);
    });
    // проверяем что все специальные поля уникальны И несут ЗАРЕЗЕРВИРОВАННЫЕ имена
    specialFields.forEach(({ name }) => {
      expect(allFields.includes(name)).toBe(false);
      expect(specialFieldsNames.includes(name)).toBe(true);
      allFields.push(name);
    });

    // для полей thing, но не subDocument
    // проверяем что поля указанные в permaLinkFields были объявлены
    if (thingName) {
      permaLinkFields.forEach(name => {
        expect(allFields.includes(name)).toBe(true);
      });
    }

    // проверяем что отсутствуют поля с запрещенными именами
    // чтобы не было путаницы запрещаем названия написанные ...
    // ... буквами в любом регистре
    const allFields2 = allFields.map(name => name.toLowerCase());
    expect(allFields2.includes('messages')).toBe(false);
    expect(allFields2.includes('created')).toBe(false);
    expect(allFields2.includes('updated')).toBe(false);
    expect(allFields2.includes('id')).toBe(false);
    // backLinks - поле присутствует в каждой mongooseModel задающей thing
    expect(allFields2.includes('backlinks')).toBe(false);
    // linksToAdd и linksToRemove - вспомогательные поля передаваемые ...
    // ... в add, update и delete чтобы добавить / убрать соответствующие ...
    // ... backlinks в экземпляры thing на которые добавляются / удаляются ссылки
    expect(allFields2.includes('linkstoadd')).toBe(false);
    expect(allFields2.includes('linkstoremove')).toBe(false);
  });
  test('should have all fields in orderOfTheFormFields', () => {
    // проверяем что все поля из всех группах полей присутствуют ...
    // ... в списке orderOfTheFormFields
    const paramFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'paramFields')
      .map(({ name }) => name)
      .sort();
    expect(paramFieldNames.sort()).toEqual(paramFieldNames2);
    // убеждаемся что для paramFieldNames в список полей формы orderOfTheFormFields
    // добавлены, атрибут multiple при необходимости
    const multipleParamFieldNames = paramFields
      .filter(({ multiple }) => multiple)
      .map(({ name }) => name)
      .sort();
    const multipleParamFieldNames2 = orderOfTheFormFields
      .filter(({ kind, multiple }) => kind === 'paramFields' && multiple)
      .map(({ name }) => name)
      .sort();
    expect(multipleParamFieldNames).toEqual(multipleParamFieldNames2);

    const booleanFieldNames = booleanFields.map(({ name }) => name);
    const booleanFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'booleanFields')
      .map(({ name }) => name)
      .sort();
    expect(booleanFieldNames.sort()).toEqual(booleanFieldNames2);

    const dateFieldNames = dateFields.map(({ name }) => name);
    const dateFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'dateFields')
      .map(({ name }) => name)
      .sort();
    expect(dateFieldNames.sort()).toEqual(dateFieldNames2);

    const numberFieldNames = numberFields.map(({ name }) => name);
    const numberFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'numberFields')
      .map(({ name }) => name)
      .sort();
    expect(numberFieldNames.sort()).toEqual(numberFieldNames2);

    const textFieldNames = textFields.map(({ name }) => name);
    const textFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'textFields')
      .map(({ name }) => name)
      .sort();
    expect(textFieldNames.sort()).toEqual(textFieldNames2);

    const specialFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'specialFields')
      .map(({ name }) => name)
      .sort();
    expect(specialFieldNames.sort()).toEqual(specialFieldNames2);

    const subDocumentArrayFieldNames = subDocumentFields.map(
      ({ name }) => name,
    );
    const subDocumentArrayFieldNames2 = orderOfTheFormFields
      .filter(({ kind }) => kind === 'subDocumentFields')
      .map(({ name }) => name)
      .sort();
    expect(subDocumentArrayFieldNames.sort()).toEqual(
      subDocumentArrayFieldNames2,
    );
    // убеждаемся что для subDocumentFields в список полей формы orderOfTheFormFields
    // добавлены, атрибут array при необходимости
    const subDocumentArrayFieldWithArraysNames = subDocumentFields
      .filter(({ array }) => array)
      .map(({ name }) => name)
      .sort();
    const subDocumentArrayFieldWithArraysNames2 = orderOfTheFormFields
      .filter(({ kind, array }) => kind === 'subDocumentFields' && array)
      .map(({ name }) => name)
      .sort();
    expect(subDocumentArrayFieldWithArraysNames).toEqual(
      subDocumentArrayFieldWithArraysNames2,
    );

    const length =
      paramFields.length +
      booleanFields.length +
      dateFields.length +
      numberFields.length +
      textFields.length +
      specialFields.length +
      subDocumentFields.length;
    expect(orderOfTheFormFields.length).toBe(length);
  });
};

export default testAppConfigThingOrSubDocumentFields;
