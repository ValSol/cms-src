/* eslint-env jest */

import humanFileSize from './humanFileSize';

describe('humanFileSize util', () => {
  test('should return 0 B', () => {
    const size = 0;
    const result = humanFileSize(size);
    expect(result).toBe('0 B');
  });
  test('should return result in B', () => {
    const size = 30;
    const result = humanFileSize(size);
    expect(result).toBe('30 B');
  });
  test('should return result in B', () => {
    const size = 300;
    const result = humanFileSize(size);
    expect(result).toBe('300 B');
  });
  test('should return result in kB', () => {
    const size = 3000;
    const result = humanFileSize(size);
    expect(result).toBe('2.93 kB');
  });
  test('should return result in kB', () => {
    const size = 30000;
    const result = humanFileSize(size);
    expect(result).toBe('29.3 kB');
  });
  test('should return result in kB', () => {
    const size = 300000;
    const result = humanFileSize(size);
    expect(result).toBe('292.97 kB');
  });
  test('should return result in MB', () => {
    const size = 3000000;
    const result = humanFileSize(size);
    expect(result).toBe('2.86 MB');
  });
  test('should return result in MB', () => {
    const size = 30000000;
    const result = humanFileSize(size);
    expect(result).toBe('28.61 MB');
  });
  test('should return result in GB', () => {
    const size = 3000000000;
    const result = humanFileSize(size);
    expect(result).toBe('2.79 GB');
  });
  test('should return result in GB', () => {
    const size = 30000000000;
    const result = humanFileSize(size);
    expect(result).toBe('27.94 GB');
  });
  test('should return result in GB', () => {
    const size = 300000000000;
    const result = humanFileSize(size);
    expect(result).toBe('279.4 GB');
  });
  test('should return result in TB', () => {
    const size = 3000000000000;
    const result = humanFileSize(size);
    expect(result).toBe('2.73 TB');
  });
  test('should return result in TB', () => {
    const size = 300000000000000;
    const result = humanFileSize(size);
    expect(result).toBe('272.85 TB');
  });
});
