/* eslint-env jest */

import makePathsList from './makePathsList';

describe('routes Utils', () => {
  describe('makePathsList', () => {
    test('should return router path list', () => {
      const pathTreeString = `trademark
  info
  price
admin
  articles`;
      const routeName = '';
      const result = makePathsList({ pathTreeString, routeName });
      const expectedResult = [
        '/trademark/info',
        '/trademark/price',
        '/admin/articles',
      ];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path list without admin routes', () => {
      const pathTreeString = `trademark
  info
  price
patent
patent
  info
  price
  law
patent
  law
    international // вот таки комментарии
    codexes // будут удалены // //
    domestic
admin
  articles('articleListRoute')`;
      const routeName = '';
      const result = makePathsList({ pathTreeString, routeName });
      const expectedResult = [
        '/trademark/info',
        '/trademark/price',
        '/patent',
        '/patent/info',
        '/patent/price',
        '/patent/law',
        '/patent/law/international',
        '/patent/law/codexes',
        '/patent/law/domestic',
      ];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path list for articleListRoute route', () => {
      const pathTreeString = `trademark
  info
  price
patent(articleListRoute, articleList)
patent
  info(articleListRoute)
  price(articleList, articleListRoute)
  law(articleList)
patent
  law
    international
    codexes
    domestic
admin
  articles('adminList')`;
      const routeName = 'articleListRoute';
      const result = makePathsList({ pathTreeString, routeName });
      const expectedResult = ['/patent', '/patent/info', '/patent/price'];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path list for articleListRoute within the route hierarchy', () => {
      const pathTreeString = `trademark
  info
  price
patent
patent
  info
  price
  law
patent
  law
    international
    codexes
    domestic
admin
  articles(articleListRoute)
    preview(articlePreviewRoute)
    delete(articleDeleteForm)
      preview(articlePreviewRoute)`;
      const routeName = 'articleListRoute';
      const result = makePathsList({ pathTreeString, routeName });
      const expectedResult = ['/admin/articles'];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path for list for articleRichTextRoute', () => {
      const routeName = 'articleRichTextRoute';
      const result = makePathsList({ routeName });
      const expectedResult = ['/admin/articles'];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path for list for articlePreviewRoute', () => {
      const routeName = 'articlePreviewRoute';
      const result = makePathsList({ routeName });
      const expectedResult = [
        '/admin/articles/preview',
        '/admin/articles/deleted/preview',
        '/admin/articles/delete/preview',
      ];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path list for signIn', () => {
      const routeName = 'signIn';
      const result = makePathsList({ routeName });
      const expectedResult = ['/signin'];
      expect(result).toEqual(expectedResult);
    });
    test('should return router path list for article', () => {
      const routeName = '';
      const result = makePathsList({ routeName });
      const expectedResult = [
        '/trademark/info',
        '/trademark/services',
        '/copyright/info',
        '/copyright/services',
        '/patent/info',
        '/patent/services',
        '/design/info',
        '/design/services',
        '/trademark/price',
        '/copyright/price',
        '/patent/price',
        '/design/price',
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
