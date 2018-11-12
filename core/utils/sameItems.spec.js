/* eslint-env jest */

import sameItems from './sameItems';

describe('sameItems', () => {
  test('should true if same items', () => {
    const array1 = ['3', '2', '1', '4'];
    const array2 = ['2', '4', '3', '1'];
    const result = sameItems(array1, array2);
    expect(result).toBeTruthy();
  });
  test('should false if same not equal length 1', () => {
    const array1 = ['3', '2', '1'];
    const array2 = ['2', '4', '3', '1'];
    const result = sameItems(array1, array2);
    expect(result).toBeFalsy();
  });
  test('should false if same not equal length 2', () => {
    const array1 = ['2', '4', '3', '1'];
    const array2 = ['3', '2', '1'];
    const result = sameItems(array1, array2);
    expect(result).toBeFalsy();
  });
  test('should false if not same items', () => {
    const array1 = ['2', '4', '3', '1'];
    const array2 = ['3', '2', '1', '5'];
    const result = sameItems(array1, array2);
    expect(result).toBeFalsy();
  });
});
