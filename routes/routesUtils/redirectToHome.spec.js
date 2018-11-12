/* eslint-env jest */

import redirectToHome from './redirectToHome';

describe('routes Utils', () => {
  describe('redirectToHome', () => {
    test('should return object with redirect to home', () => {
      const baseUrl = '/en/admin/articles';
      const context = { baseUrl };
      const result = redirectToHome(context);
      const expectedResult = {
        redirect: '/en',
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
