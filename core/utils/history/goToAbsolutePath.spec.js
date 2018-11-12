/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import history from '../../../history';
import goToAbsolutePath from './goToAbsolutePath';

describe('goToAbsolutePath', () => {
  test('should go to absolute path taking into account locale', () => {
    history.push('/en/admin/articles/delete/1234567890');
    const absolutePath = '/signin';
    goToAbsolutePath(absolutePath);
    const expectedResult = '/en/signin';
    const result = history.location.pathname;
    expect(result).toBe(expectedResult);
  });
  test('should go to absolute path with query taking into account locale', () => {
    history.push('/en/admin/articles/delete/1234567890');
    const absolutePath = '/search';
    const query = { q: 'trade marks', m: 'articles' };
    goToAbsolutePath(absolutePath, false, query);
    const expectedResult = '/en/search?m=articles&q=trade%20marks';
    const result = `${history.location.pathname}${history.location.search}`;
    expect(result).toBe(expectedResult);
  });
});
