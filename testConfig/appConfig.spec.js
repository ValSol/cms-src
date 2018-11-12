/* eslint-env jest */
import {
  appName,
  buttonBottomShift,
  components,
  getThingConfig,
  locales,
  mongoLanguages,
  paperPadding,
  params,
  picturesSelectCellHeight,
  thingNames,
} from '../appConfig';
import { makePathsList } from '../routes/routesUtils';

describe('appConfig', () => {
  test('should have appName', () => {
    expect(typeof appName).toBe('string');
  });
  test('should have thingNames, and have correct names', () => {
    expect(thingNames.length).toBeGreaterThan(0);
    // проверяем что в названиях Things присутствуют только правильные символы
    const reg = /^[A-Z][A-Za-z0-9]*$/;
    thingNames.forEach(thingName => {
      expect(reg.test(thingName)).toBe(true);
    });
    // проверяем что отсутствуют зарегистрированные значения
    ['Param', 'Params', 'Thing', 'User'].forEach(thingName => {
      expect(thingNames.includes(thingName)).toBe(false);
    });
  });
  test('should have correct locales', () => {
    expect(thingNames.length).toBeGreaterThan(0);
    // проверяем что для каждой локали назначены соответствующие значения
    locales.forEach(locale => {
      expect(typeof mongoLanguages[locale]).toBe('string');
    });
  });
  test('should have correct components', () => {
    const { Footer } = components;
    // проверяем наличие компоненты Footer
    expect(Footer).toBeDefined();
  });
  test('should have params, and have param keys', () => {
    const reservedKeys = ['_id', 'items', 'thingName'];
    // проверяем что отсутствуют зарегистрированные значения
    Object.keys(params).forEach(key => {
      expect(reservedKeys.includes(key)).toBe(false);
      expect(params[key].length).toBeGreaterThan(0);
    });
  });
  test('should have correct number attributes', () => {
    expect(typeof picturesSelectCellHeight).toBe('number');
    expect(picturesSelectCellHeight).toBeGreaterThan(0);
    expect(typeof paperPadding).toBe('number');
    expect(paperPadding).toBeGreaterThan(0);
    expect(typeof buttonBottomShift).toBe('number');
    expect(buttonBottomShift).toBeGreaterThan(0);
  });
  test('should have all routeNames in pathTree', () => {
    const prefixes = [
      // 'SearchRoute', - НЕ обязательный для использования роут
      'ListRoute',
      'UpdateRoute',
      'PreviewRoute',
      'RecoverRoute',
      'AddRoute',
      'DeleteRoute',
      'SearchFormsRoute',
      'ExportRoute',
      'ImportRoute',
      'DBStatusRoute',
    ];
    thingNames.forEach(thingName => {
      const { richTextFields } = getThingConfig(thingName);
      // если имеются ricthText поля, то должен быть и соответствующий роут
      if (richTextFields.length) prefixes.push('RichTextRoute');
      const thingName2 = thingName.toLowerCase(); // с маленькой буквы
      prefixes.forEach(prefix => {
        expect(
          makePathsList({ routeName: `${thingName2}${prefix}` }).length,
        ).toBeGreaterThan(0);
      });
    });
  });
});
