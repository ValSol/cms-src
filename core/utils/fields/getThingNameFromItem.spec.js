/* eslint-env jest */
import getThingNameFromItem from './getThingNameFromItem';

describe('getThingNameFromItem', () => {
  test('should get thinName of item', () => {
    const __typename = 'ArticleType';
    const expectedResult = 'Article';
    const result = getThingNameFromItem({ __typename });
    expect(result).toBe(expectedResult);
  });
});
