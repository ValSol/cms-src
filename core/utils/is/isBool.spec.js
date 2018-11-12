/* eslint-env jest */
import isBool from './isBool';

describe('isBool util', () => {
  test('should return true for false', () => {
    const arg = true;
    const result = isBool(arg);
    expect(result).toBe(true);
  });
  test('should return true for true', () => {
    const arg = false;
    const result = isBool(arg);
    expect(result).toBe(true);
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isBool(arg);
    expect(result).toBe(false);
  });
  test('should return false for string', () => {
    const arg = '1';
    const result = isBool(arg);
    expect(result).toBe(false);
  });
});
