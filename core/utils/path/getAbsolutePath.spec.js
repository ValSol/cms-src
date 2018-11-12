/* eslint-env jest */

import getAbsolutePath from './getAbsolutePath';

describe('getAbsolutePath', () => {
  test('should return same path', () => {
    const path = '/some/path';
    const result = getAbsolutePath(path);
    expect(result).toBe('/some/path');
  });
  test('should return path without trailing /', () => {
    const path = '/some/path/';
    const result = getAbsolutePath(path);
    expect(result).toBe('/some/path');
  });
  test('should return path without en', () => {
    const path = '/en/some/path/';
    const result = getAbsolutePath(path);
    expect(result).toBe('/some/path');
  });
  test('should return path without en with backShift = 1', () => {
    const path = '/en/some/path/';
    const result = getAbsolutePath(path, 1);
    expect(result).toBe('/some');
  });
  test('should return path without en with backShift = 2', () => {
    const path = '/en/some/path/';
    const result = getAbsolutePath(path, 2);
    expect(result).toBe('/');
  });
});
