/* eslint-env jest */
import isNumber from './isNumber';

describe('isNumber util', () => {
  test('should return true for integer', () => {
    const arg = 1;
    const result = isNumber(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for function', () => {
    const arg = () => {};
    const result = isNumber(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isNumber(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for string', () => {
    const arg = '1';
    const result = isNumber(arg);
    expect(result).toBeFalsy();
  });
});
