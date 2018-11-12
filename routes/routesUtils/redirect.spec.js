/* eslint-env jest */

import redirect, { redirectAction } from './redirect';

describe('routes Utils', () => {
  describe('redirect util', () => {
    test('should return object for redirect', () => {
      const from = 'uk';
      const to = '/';
      const [redirectObject] = redirect([[from, to]]);
      const expectedResult = {
        path: 'uk',
        children: [
          {
            action: context => redirectAction(from, to, context),
            path: '(.*)',
          },
        ],
      };

      expect(redirectObject.path).toBe(expectedResult.path);
      expect(redirectObject.children[0].path).toBe(
        expectedResult.children[0].path,
      );
      expect(redirectObject.children[0].action).toBeDefined();
    });
  });
  describe('action method', () => {
    test('should return redirect path', () => {
      const baseUrl = '/uk';
      const path = '/patent/info/abc';
      const query = { search: 'price' };
      const result = redirectAction('/uk', '', {
        baseUrl,
        path,
        query,
      });
      const expectedResult = {
        redirect: '/patent/info/abc?search=price',
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
