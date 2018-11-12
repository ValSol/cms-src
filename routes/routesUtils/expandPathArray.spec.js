/* eslint-env jest */

import expandPathArray from './expandPathArray';

describe('routesUtils expandPathArray', () => {
  const params = {
    subject: ['trademark', 'copyright', 'patent', 'design'],
    section: ['info', 'services'],
  };
  test('should expand path with params', () => {
    const pathArray = [':subject', ':section'];
    const result = expandPathArray(pathArray, params);
    const expectedResult = [
      ['trademark', 'info'],
      ['trademark', 'services'],
      ['copyright', 'info'],
      ['copyright', 'services'],
      ['patent', 'info'],
      ['patent', 'services'],
      ['design', 'info'],
      ['design', 'services'],
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should expand path with params 2', () => {
    const pathArray = [':section', ':subject'];
    const result = expandPathArray(pathArray, params);
    const expectedResult = [
      ['info', 'trademark'],
      ['info', 'copyright'],
      ['info', 'patent'],
      ['info', 'design'],
      ['services', 'trademark'],
      ['services', 'copyright'],
      ['services', 'patent'],
      ['services', 'design'],
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should expand path with params 3', () => {
    const pathArray = [':subject', 'prices'];
    const result = expandPathArray(pathArray, params);
    const expectedResult = [
      ['trademark', 'prices'],
      ['copyright', 'prices'],
      ['patent', 'prices'],
      ['design', 'prices'],
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should not expand path with NOT params', () => {
    const pathArray = ['admin', 'articles'];
    const result = expandPathArray(pathArray, params);
    const expectedResult = [['admin', 'articles']];
    expect(result).toEqual(expectedResult);
  });
});
