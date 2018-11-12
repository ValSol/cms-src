/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import history from '../../../history';
import goToAnotherLocale from './goToAnotherLocale';

describe('goToAnotherLocale', () => {
  test('should go from some locale to default locale', () => {
    history.push('/en/admin/articles/delete/1234567890');
    const newLocale = 'uk';
    goToAnotherLocale(newLocale);
    const expectedResult = '/admin/articles/delete/1234567890';
    const result = history.location.pathname;
    expect(result).toBe(expectedResult);
  });
  test('should go from default locale to anouther locale', () => {
    history.push('/admin/articles/delete/1234567890');
    const newLocale = 'ru';
    goToAnotherLocale(newLocale);
    const expectedResult = '/ru/admin/articles/delete/1234567890';
    const result = history.location.pathname;
    expect(result).toBe(expectedResult);
  });
  test('should go from one locale to anouther locale', () => {
    history.push('/ru/admin/articles/delete/1234567890');
    const newLocale = 'en';
    goToAnotherLocale(newLocale);
    const expectedResult = '/en/admin/articles/delete/1234567890';
    const result = history.location.pathname;
    expect(result).toBe(expectedResult);
  });
});
