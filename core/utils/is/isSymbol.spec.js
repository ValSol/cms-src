/* eslint-env jest */

import isSymbol from './isSymbol';

describe('isSymbol util', () => {
  test('should return true for Symbol', () => {
    const arg = Symbol(1);
    const result = isSymbol(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isSymbol(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for null', () => {
    const arg = null;
    const result = isSymbol(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isSymbol(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for function', () => {
    const arg = () => {};
    const result = isSymbol(arg);
    expect(result).toBeFalsy();
  });
});
