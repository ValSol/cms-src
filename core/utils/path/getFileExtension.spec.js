/* eslint-env jest */

import getFileExtension from './getFileExtension';

describe('getFileExtension util', () => {
  test('should return extension for "example.txt" file', () => {
    const fileName = 'example.txt';
    const result = getFileExtension(fileName);
    expect(result).toBe('txt');
  });
  test('should return extension for "example.file.txt" file', () => {
    const fileName = 'example.file.txt';
    const result = getFileExtension(fileName);
    expect(result).toBe('txt');
  });
  test('should return extension for ".txt" file', () => {
    const fileName = '.txt';
    const result = getFileExtension(fileName);
    expect(result).toBe('txt');
  });
  test('should not return extension in "example" file', () => {
    const fileName = 'example';
    const result = getFileExtension(fileName);
    expect(result).toBe('');
  });
  test('should return extension in "example." file', () => {
    const fileName = 'example.';
    const result = getFileExtension(fileName);
    expect(result).toBe('');
  });
});
