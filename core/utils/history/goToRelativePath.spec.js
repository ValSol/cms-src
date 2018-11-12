/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import history from '../../../history';
import goToRelativePath from './goToRelativePath';

describe('goToRelativePath', () => {
  test('should go to relative path with back shift', () => {
    history.push('/admin/articles/delete/1234567890');
    const relativePath = '/new';
    const backShift = 2;
    goToRelativePath(relativePath, backShift);
    const expectedResult = '/admin/articles/new';
    const result = history.location.pathname;
    expect(result).toBe(expectedResult);
  });
});
