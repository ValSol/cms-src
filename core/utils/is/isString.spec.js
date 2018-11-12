/* eslint-env jest */
import isString from './isString';

describe('isString util', () => {
  test('should return true for string', () => {
    const arg = '1';
    const result = isString(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for null', () => {
    const arg = null;
    const result = isString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for function', () => {
    const arg = () => {};
    const result = isString(arg);
    expect(result).toBeFalsy();
  });
});
