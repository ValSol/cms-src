/* eslint-env jest */
import isObject from './isObject';

describe('isNumber util', () => {
  test('should return true for object', () => {
    const arg = { x: 1 };
    const result = isObject(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for null', () => {
    const arg = null;
    const result = isObject(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isObject(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for function', () => {
    const arg = () => {};
    const result = isObject(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for string', () => {
    const arg = '1';
    const result = isObject(arg);
    expect(result).toBeFalsy();
  });
});
