/* eslint-env jest */

import composePathWithLocale from './composePathWithLocale';

describe('composePathWithLocale', () => {
  test('should return path for uk locale', () => {
    const path = '/some/path';
    const locale = 'uk';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/some/path');
  });
  test('should return path for uk locale 2', () => {
    const path = '/en/some/path';
    const locale = 'uk';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/some/path');
  });
  test('should return path for en locale', () => {
    const path = '/some/path';
    const locale = 'en';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/en/some/path');
  });
  test('should return path for en locale 2', () => {
    const path = '/en/some/path';
    const locale = 'en';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/en/some/path');
  });
  test('should return root path for uk locale', () => {
    const path = '/';
    const locale = 'uk';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/');
  });
  test('should return root path for uk locale 2', () => {
    const path = '/en';
    const locale = 'uk';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/');
  });
  test('should return root path for en locale', () => {
    const path = '/';
    const locale = 'en';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/en');
  });
  test('should return root path for en locale 2', () => {
    const path = '/en';
    const locale = 'en';
    const result = composePathWithLocale(path, locale);
    expect(result).toBe('/en');
  });
});
