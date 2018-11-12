/* eslint-env jest */
import isFunction from './isFunction';

describe('isArray util', () => {
  test('should return true for function', () => {
    const arg = () => {};
    const result = isFunction(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isFunction(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for string', () => {
    const arg = '1';
    const result = isFunction(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isFunction(arg);
    expect(result).toBeFalsy();
  });
});
