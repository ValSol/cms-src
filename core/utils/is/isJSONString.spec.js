/* eslint-env jest */
import isJSONString from './isJSONString';

describe('isJSONString util', () => {
  test('should return true for JSON string', () => {
    const arg = JSON.stringify({ blocks: [{ x: 1 }, { x: '2' }] });
    const result = isJSONString(arg);
    expect(result).toBeTruthy();
  });
  test('should return false for not JSON string', () => {
    const arg = 'abc';
    const result = isJSONString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for object', () => {
    const arg = { x: 1 };
    const result = isJSONString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for null', () => {
    const arg = null;
    const result = isJSONString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for integer', () => {
    const arg = 1;
    const result = isJSONString(arg);
    expect(result).toBeFalsy();
  });
  test('should return false for function', () => {
    const arg = () => {};
    const result = isJSONString(arg);
    expect(result).toBeFalsy();
  });
});
