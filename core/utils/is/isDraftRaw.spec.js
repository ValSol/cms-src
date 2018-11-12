/* eslint-env jest */

import isDraftRaw from './isDraftRaw';

describe('isDraftRaw util', () => {
  test('should return true for correct object', () => {
    const raw = { entityMap: {}, blocks: [] };
    const result = isDraftRaw(raw);
    expect(result).toBe(true);
  });
  test('should return false for incorrect object', () => {
    const raw = { entityMap: {} };
    const result = isDraftRaw(raw);
    expect(result).toBe(false);
  });
  test('should return false for incorrect object 2', () => {
    const raw = { blocks: [] };
    const result = isDraftRaw(raw);
    expect(result).toBe(false);
  });
  test('should return true for incorrect object 3', () => {
    const raw = { entityMap: [], blocks: {} };
    const result = isDraftRaw(raw);
    expect(result).toBe(false);
  });
  test('should return false for incorrect arg', () => {
    const raw = 'raw';
    const result = isDraftRaw(raw);
    expect(result).toBe(false);
  });
});
