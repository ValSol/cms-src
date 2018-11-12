/* eslint-env jest */
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { populateArticles } from '../../data/seed';
import { getThingModel } from '../../../../data/mongooseModels';

import { auth } from '../../../../config';

const request = supertest('http://localhost:3000');

describe('ArticleForm route', () => {
  let Article;
  beforeAll(() =>
    getThingModel('Article').then(result => {
      Article = result;
    }),
  );

  beforeEach(populateArticles);

  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

  describe('updateArticle route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/en/admin/articles/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/ru/admin/articles/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (articles list)', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });

    test('should return 404 for authenticated user for incorrect url', async () => {
      await request
        .get('/admin/articles/123456890')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });

    test('should return 404 if not authenticated for incorrect url', async () => {
      await request.get('/admin/articles/123456890').expect(404);
    });
  });

  describe('addArticle route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      await request
        .get('/admin/articles/new')
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      await request
        .get('/en/admin/articles/new')
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      await request
        .get('/ru/admin/articles/new')
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (articles list)', async () => {
      await request
        .get('/admin/articles/new')
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });
  });

  describe('recoverArticle route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      await request
        .get('/admin/articles/deleted')
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      await request
        .get('/en/admin/articles/deleted')
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      await request
        .get('/ru/admin/articles/deleted')
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (deleted article)', async () => {
      await request
        .get('/admin/articles/deleted')
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });
  });

  describe('recoverArticle route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      await request
        .get('/admin/articles')
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      await request
        .get('/en/admin/articles')
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      await request
        .get('/ru/admin/articles')
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (articles list)', async () => {
      await request
        .get('/admin/articles')
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });
  });
  describe('deleteArticle route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/delete/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/en/admin/articles/delete/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/ru/admin/articles/delete/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (deleting article)', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/delete/${article._id.toString()}`) // eslint-disable-line no-underscore-dangle
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });

    test('should return 404 for authenticated user for incorrect url', async () => {
      await request
        .get('/admin/articles/delete/123456890')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });

    test('should return 404 if not authenticated for incorrect url', async () => {
      await request.get('/admin/articles/delete/123456890').expect(404);
    });
  });

  describe('articleRichTextRoute route', () => {
    test('should redirect to /signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/${article._id.toString()}/content`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/signin')
        .expect(302);
    });

    test('should redirect to /en/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/en/admin/articles/${article._id.toString()}/content`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/en/signin')
        .expect(302);
    });

    test('should redirect to /ru/signin if not authenticated', async () => {
      const article = await Article.findOne();
      await request
        .get(`/ru/admin/articles/${article._id.toString()}/content`) // eslint-disable-line no-underscore-dangle
        .expect('Location', '/ru/signin')
        .expect(302);
    });

    test('should return 200 authenticated user (articles list)', async () => {
      const article = await Article.findOne();
      await request
        .get(`/admin/articles/${article._id.toString()}/content`) // eslint-disable-line no-underscore-dangle
        .set('Cookie', `id_token=${token}`)
        .expect(200);
    });

    test('should return 404 for authenticated user for incorrect url', async () => {
      await request
        .get('/admin/articles/123456890/content')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });

    test('should return 404 if not authenticated for incorrect url', async () => {
      await request.get('/admin/articles/123456890/content').expect(404);
    });
  });
  describe('articlePreviewRoute route', () => {
    test('should return article for preview in ukraine', async () => {
      const article = await Article.findOne();

      const response = await request
        .get(`/admin/articles/preview/${article._id}`) // eslint-disable-line no-underscore-dangle
        .set('Cookie', `id_token=${token}`)
        .expect(200);
      expect(response.text).toContain(article.title.uk);
      expect(response.text).not.toContain(article.title.ru);
      expect(response.text).not.toContain(article.title.en);
      expect(response.text).toContain('Редагування');
      expect(response.text).toContain('Попередній перегляд');
    });
    test('should return article for preview in english', async () => {
      const article = await Article.findOne();

      const response = await request
        .get(`/en/admin/articles/preview/${article._id}`) // eslint-disable-line no-underscore-dangle
        .set('Cookie', `id_token=${token}`)
        .expect(200);
      expect(response.text).not.toContain(article.title.uk);
      expect(response.text).not.toContain(article.title.ru);
      expect(response.text).toContain(article.title.en);
      expect(response.text).toContain('Editing');
      expect(response.text).toContain('Preview');
    });
    test('should return deleted article for preview', async () => {
      const response = await request
        .get('/admin/articles/deleted/preview')
        .set('Cookie', `id_token=${token}`)
        .expect(200);
      expect(response.text).toContain('Відновлення');
      expect(response.text).toContain('Попередній перегляд');
    });
    test('should return 404 for empty slug', async () => {
      await request
        .get('/en/admin/articles/preview')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });
    test('should return 404 for incorrect slug', async () => {
      await request
        .get('/en/admin/articles/preview/incorrect-slug')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });
    test('should return 404 unexisting article id in slug', async () => {
      await request
        .get('/en/admin/articles/preview/58c260bb1be5871ffcac13a3')
        .set('Cookie', `id_token=${token}`)
        .expect(404);
    });
  });
});
