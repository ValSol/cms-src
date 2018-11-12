/* eslint-env jest */

import isArray from './isArray';

describe('isArray util', () => {
  test('should return true for array', () => {
    const arg = [];
    const result = isArray(arg);
    expect(result).toBeTruthy();
  });
  test('should return true for array 2', () => {
    const arg = [1, 2, 3];
    const result = isArray(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isArray(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for string', () => {
    const arg = '1';
    const result = isArray(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isArray(arg);
    expect(result).toBeFalsy();
  });
});
