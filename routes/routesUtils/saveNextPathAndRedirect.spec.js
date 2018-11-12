/* eslint-env jest */

import redirectToHome from './redirectToHome';

describe('routes Utils', () => {
  describe('redirectToHome', () => {
    test('should return object with redirect to home', () => {
      const slug = '/signin';
      const baseUrl = '/en';
      const context = { params: { slug }, baseUrl };
      const result = redirectToHome(context);
      const expectedResult = {
        redirect: '/en',
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
