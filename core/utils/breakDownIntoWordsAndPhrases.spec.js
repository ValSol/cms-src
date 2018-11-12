/* eslint-env jest */

import breakDownIntoWordsAndPhrases from './breakDownIntoWordsAndPhrases';

describe('breakDownIntoWordsAndPhrases', () => {
  test('should return array with words and phrases', () => {
    const str = ' некоторые способы  "искать в базе" данных';
    const result = breakDownIntoWordsAndPhrases(str);
    const expectedResult = [
      'некоторые',
      'способы',
      '"искать в базе"',
      'данных',
    ];
    expect(result).toEqual(expectedResult);
  });
});
