/* eslint-env jest */

import unfoldPathTree from './unfoldPathTree';

describe('routes Utils', () => {
  describe('unfoldPathTree', () => {
    test('should return router tree', () => {
      const pathTreeString = `
trademark
  info
  price
admin  // комментарий
  articles`;
      const article = () => {};
      const routes = {};
      const result = unfoldPathTree(pathTreeString, article, routes);
      expect(result[0].path).toBe('/trademark');
      expect(result[0].children[0].path).toBe('/info');
      expect(result[0].children[1].path).toBe('/price');
      expect(result[1].path).toBe('/admin');
      expect(result[1].children[0].path).toBe('/articles');
      expect(result.length).toBe(2);
      expect(result[0].children.length).toBe(2);
      expect(result[1].children.length).toBe(1);
    });
    test('should return router tree', () => {
      const article = { action: 'article' };
      const routes = {
        articleForm: { action: 'articleListRoute' },
        articleForm2: { action: 'articleForm2' },
        articleForm3: { action: 'articleForm3' },
        articleDeleteForm: { action: 'articleDeleteForm' },
        signIn: { action: 'signIn' },
        signIn2: { action: 'signIn2' },
        signIn3: { action: 'signIn3' },
        signUp: { action: 'signUp' },
      };
      const pathTreeString = `
patent
  info
  services
admin
  articles(articleForm,articleForm2,articleForm3) // комментарий
    delete(articleDeleteForm) // комментарий
signin(signIn,signIn2,signIn3)
signup(signUp)`;
      const result = unfoldPathTree(pathTreeString, article, routes);
      const expectedResult = [
        {
          path: '/patent',
          children: [
            {
              path: '/info',
              children: [{ action: 'article' }],
            },
            {
              path: '/services',
              children: [{ action: 'article' }],
            },
          ],
        },
        {
          path: '/admin',
          children: [
            {
              path: '/articles',
              children: [
                {
                  path: '/delete',
                  children: [{ action: 'articleDeleteForm' }],
                },
                { action: 'articleListRoute' },
                { action: 'articleForm2' },
                { action: 'articleForm3' },
              ],
            },
          ],
        },
        {
          path: '/signin',
          children: [
            { action: 'signIn' },
            { action: 'signIn2' },
            { action: 'signIn3' },
          ],
        },
        {
          path: '/signup',
          children: [{ action: 'signUp' }],
        },
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
