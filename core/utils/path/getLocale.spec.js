/* eslint-env jest */

import getLocale from './getLocale';

describe('getLocale util', () => {
  test('should return locale for root path', () => {
    const path = '/';
    const result = getLocale(path);
    expect(result).toBe('uk');
  });
  test('should return locale for root path with en', () => {
    const path = '/en';
    const result = getLocale(path);
    expect(result).toBe('en');
  });
  test('should return locale for root path with en 2', () => {
    const path = '/en/';
    const result = getLocale(path);
    expect(result).toBe('en');
  });
  test('should return default locale', () => {
    const path = '/test/path';
    const result = getLocale(path);
    expect(result).toBe('uk');
  });
  test('should return ru locale', () => {
    const path = '/ru/test/path';
    const result = getLocale(path);
    expect(result).toBe('ru');
  });
});
