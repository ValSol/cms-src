/* eslint-env jest */

import validate from './validate';

describe('signUp Form validate', () => {
  test('should return error for empty required fields', () => {
    const fields = {};
    const result = validate(fields);
    const expectedResult = {
      email: 'RequiredField',
      password: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return error for incorrect email', () => {
    const fields = { email: 'incorrect' };
    const result = validate(fields);
    const expectedResult = {
      email: 'InvalidEmail',
      password: 'RequiredField',
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return empty dictionary for all correct field', () => {
    const fields = {
      email: 'example@example.com',
      password: 'password123',
    };
    const result = validate(fields);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
});
