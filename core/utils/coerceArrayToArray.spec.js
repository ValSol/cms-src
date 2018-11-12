/* eslint-env jest */

import coerceArrayToArray from './coerceArrayToArray';

describe('coerceArrayToArray util', () => {
  test('should return coerced array', () => {
    const arr1 = [
      'x1',
      'a1',
      'x2',
      'a2',
      'a3',
      'x3',
      'a4',
      'a5',
      'a6',
      'x4',
      'a7',
    ];
    const arr2 = [
      'a5',
      'a4',
      'y1',
      'a3',
      'y2',
      'a1',
      'a7',
      'a6',
      'a2',
      'y3',
      'y4',
    ];
    const expectedResult = [
      'a1',
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'a7',
      'y1',
      'y2',
      'y3',
      'y4',
    ];
    const result = coerceArrayToArray(arr1, arr2);
    expect(result).toEqual(expectedResult);
  });
  test('should return coerced array for arrays with the same items', () => {
    const arr1 = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
    const arr2 = ['a5', 'a4', 'a3', 'a1', 'a7', 'a6', 'a2'];
    const expectedResult = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'];
    const result = coerceArrayToArray(arr1, arr2);
    expect(result).toEqual(expectedResult);
  });
  test('should return coerced array for arrays with different items', () => {
    const arr1 = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'];
    const arr2 = ['y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7'];
    const expectedResult = ['y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7'];
    const result = coerceArrayToArray(arr1, arr2);
    expect(result).toEqual(expectedResult);
  });
});
