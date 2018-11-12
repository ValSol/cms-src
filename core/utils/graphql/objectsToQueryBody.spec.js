/* eslint-env jest */

import objectsToQueryBody, { objectToString } from './objectsToQueryBody';

describe('fetchGraphQL utils', () => {
  describe('objectToString', () => {
    const args = {
      input: {
        _id: '1234567890',
        email: 'example@example.com',
      },
    };
    test('should return string of object with values for GraphQL', () => {
      const result = objectToString(args);
      const expectedResult =
        'input:{_id:"1234567890",email:"example@example.com"}';
      expect(result).toBe(expectedResult);
    });
    test('should return string of object withot values (only keys) for GraphQL', () => {
      const onlyFields = true;
      const result = objectToString(args, onlyFields);
      const expectedResult = 'input{_id,email}';
      expect(result).toBe(expectedResult);
    });
    test('should return string of object with values for GraphQL', () => {
      const onlyFields = false;
      const inCurlyBraces = true;
      const result = objectToString(args, onlyFields, inCurlyBraces);
      const expectedResult =
        '{input:{_id:"1234567890",email:"example@example.com"}}';
      expect(result).toBe(expectedResult);
    });
    test('should return object with array values for GraphQL', () => {
      const argsWithArray = {
        href: '/patent/info',
        items: ['item0', 1, { x: ['item2'] }, [2, 3]],
      };
      const onlyFields = false;
      const inCurlyBraces = true;
      const result = objectToString(argsWithArray, onlyFields, inCurlyBraces);
      const expectedResult =
        '{href:"/patent/info",items:["item0",1,{x:["item2"]},[2,3]]}';
      expect(result).toBe(expectedResult);
    });
    test('should return object with number values for GraphQL', () => {
      const argsWithArray = {
        href: '/patent/info',
        count: 7,
      };
      const onlyFields = false;
      const inCurlyBraces = true;
      const result = objectToString(argsWithArray, onlyFields, inCurlyBraces);
      const expectedResult = '{href:"/patent/info",count:7}';
      expect(result).toBe(expectedResult);
    });
  });
  describe('objectsToQueryBody', () => {
    test('should return string of object with values for GraphQL', () => {
      const name = 'signin';
      const args = {
        input: {
          email: 'example@example.com',
          password: '12345',
        },
      };
      const fields = {
        user: {
          email: null,
          _id: null,
          role: null,
        },
      };
      const mutation = true;
      const result = objectsToQueryBody(name, args, fields, mutation);
      const expectedResult =
        '{"query":"mutation{signin(input:{email:\\"example@example.com\\",password:\\"12345\\"}){user{email,_id,role}}}"}';
      expect(result).toBe(expectedResult);
    });
    test('should return string of object with values without orderOfTheFormFields for GraphQL', () => {
      const name = 'thingName';
      const args = { _id: '1234567890' };
      const result = objectsToQueryBody(name, args);
      const expectedResult = '{"query":"{thingName(_id:\\"1234567890\\")}"}';
      expect(result).toBe(expectedResult);
    });
  });
});
