/* eslint-env jest */

import composeSearchQueries from './composeSearchQueries';

describe('composeSearchQueries util for search mutation', () => {
  test('should return 1 item array', () => {
    const query = ' китайский';
    const result = composeSearchQueries(query);
    const expectedResult = ['китайский'];
    expect(result.length).toBe(1);
    expect(result).toEqual(expectedResult);
  });
  test('should return 2 item array', () => {
    const query = ' китайская жаренная  лапша';
    const result = composeSearchQueries(query);
    const expectedResult = [
      '"китайская жаренная лапша"',
      'китайская жаренная лапша',
    ];
    expect(result.length).toBe(2);
    expect(result).toEqual(expectedResult);
  });
  test('should return 1 item array with quoted frase', () => {
    const query = ' китайская  "жаренная лапша"';
    const result = composeSearchQueries(query);
    const expectedResult = ['китайская "жаренная лапша"'];
    expect(result.length).toBe(1);
    expect(result).toEqual(expectedResult);
  });
  test('should return empty array', () => {
    const query = ' ';
    const result = composeSearchQueries(query);
    expect(result.length).toBe(0);
  });
});
