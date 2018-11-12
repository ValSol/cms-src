/* eslint-env jest */

import getNearestPath from './getNearestPath';

describe('routes Utils', () => {
  const pathsList = [
    '/admin/articles/preview',
    '/admin/articles/content/preview',
    '/admin/articles/delete/preview',
  ];
  const pathsListForSeveralRoutes = [
    '/admin/articles/delete',
    '/admin/articles/deleted',
    '/admin/articles',
    '/admin/articles',
  ];
  test('should return nearestPath for "/admin/articles" baseUrl', () => {
    const baseUrl = '/admin/articles';
    const expectedResult = '/admin/articles/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles/content" baseUrl', () => {
    const baseUrl = '/admin/articles/content';
    const expectedResult = '/admin/articles/content/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles/delete" baseUrl', () => {
    const baseUrl = '/en/admin/articles/delete';
    const expectedResult = '/admin/articles/delete/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles/edit" baseUrl', () => {
    const baseUrl = '/ru/admin/articles/edit';
    const expectedResult = '/admin/articles/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles/content/test" baseUrl', () => {
    const baseUrl = '/admin/articles/content/test';
    const expectedResult = '/admin/articles/content/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin2/articles/content/test" baseUrl', () => {
    const baseUrl = '/admin2/articles/content/test';
    const expectedResult = '/admin/articles/preview';
    const result = getNearestPath(baseUrl, pathsList);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles/preview" baseUrl', () => {
    const baseUrl = '/admin/articles/preview';
    const expectedResult = '/admin/articles';
    const result = getNearestPath(baseUrl, pathsListForSeveralRoutes);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles" baseUrl', () => {
    const baseUrl = '/admin/articles/delete/preview';
    const expectedResult = '/admin/articles/delete';
    const result = getNearestPath(baseUrl, pathsListForSeveralRoutes);
    expect(result).toBe(expectedResult);
  });
  test('should return nearestPath for "/admin/articles" baseUrl', () => {
    const baseUrl = '/admin/articles/deleted/preview';
    const expectedResult = '/admin/articles/deleted';
    const result = getNearestPath(baseUrl, pathsListForSeveralRoutes);
    expect(result).toBe(expectedResult);
  });
});
