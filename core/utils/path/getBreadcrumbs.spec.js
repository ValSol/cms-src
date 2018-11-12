/* eslint-env jest */

import getBreadcrumbs from './getBreadcrumbs';

describe('getBreadcrumbs util', () => {
  test('should return array for path', () => {
    const path = '/some/path';
    const result = getBreadcrumbs(path);
    const expectedResult = ['some', 'path'];
    expect(result).toEqual(expectedResult);
  });
  test('should return array for path with trailing slash', () => {
    const path = '/some/path/';
    const result = getBreadcrumbs(path);
    const expectedResult = ['some', 'path'];
    expect(result).toEqual(expectedResult);
  });
  test('should return empty array root path', () => {
    const path = '/';
    const result = getBreadcrumbs(path);
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });
});
