/* eslint-env jest */

import equalArrays from './equalArrays';

describe('equalArrays util', () => {
  test('should return true for equal arrays', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [1, 2, 3, 4];
    const result = equalArrays(arr1, arr2);
    expect(result).toBeTruthy();
  });
  test('should return false for arrays with different length', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3, 4];
    const result = equalArrays(arr1, arr2);
    expect(result).toBeFalsy();
  });
  test('should return false for arrays with different elements', () => {
    const arr1 = [1, 5, 3, 4];
    const arr2 = [1, 2, 3, 4];
    const result = equalArrays(arr1, arr2);
    expect(result).toBeFalsy();
  });
});
