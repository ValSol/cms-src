/* eslint-env jest */
import getFieldValue from './getFieldValue';

describe('getFieldValue', () => {
  test('should get value by simple path', () => {
    const path = 'aaa';
    const obj = { aaa: 'AAA' };
    const expectedResult = 'AAA';
    const result = getFieldValue(obj, path);
    expect(result).toBe(expectedResult);
  });
  test('should get value by two levels path', () => {
    const path = 'aaa[bbb]';
    const obj = { aaa: { bbb: 'BBB' } };
    const expectedResult = 'BBB';
    const result = getFieldValue(obj, path);
    expect(result).toBe(expectedResult);
  });
  test('should get value by tree levels path', () => {
    const path = 'aaa[bbb][ccc]';
    const obj = { aaa: { bbb: { ccc: 'CCC' } } };
    const expectedResult = 'CCC';
    const result = getFieldValue(obj, path);
    expect(result).toBe(expectedResult);
  });
});
