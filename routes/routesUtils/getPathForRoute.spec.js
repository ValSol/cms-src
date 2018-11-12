/* eslint-env jest */

import getPathForRoute from './getPathForRoute';

describe('routes Utils', () => {
  test('should return path for "/admin/articles" baseUrl and "articleSearchFormsRoute" route', () => {
    const baseUrl = '/admin/articles';
    const routeName = 'articleSearchFormsRoute';
    const expectedResult = '/admin/articles/search';
    const result = getPathForRoute(baseUrl, routeName);
    expect(result).toBe(expectedResult);
  });
  test('should return path for "/en/patent/info" baseUrl and "articleSearchRoute" route', () => {
    const baseUrl = '/en/patent/info';
    const routeName = 'articleSearchRoute';
    const expectedResult = '/search';
    const result = getPathForRoute(baseUrl, routeName);
    expect(result).toBe(expectedResult);
  });
  test('should return path for "/ru/admin/articles/delete" baseUrl and "preview" route', () => {
    const baseUrl = '/en/admin/articles/content';
    const routeName = 'articlePreviewRoute';
    const expectedResult = '/admin/articles/preview';
    const result = getPathForRoute(baseUrl, routeName);
    expect(result).toBe(expectedResult);
  });
  test('should return path for "/en/patent/info" baseUrl and "" route', () => {
    const baseUrl = '/en/patent/info';
    const expectedResult = '/patent/info';
    const result = getPathForRoute(baseUrl);
    expect(result).toBe(expectedResult);
  });
});
