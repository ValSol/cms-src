/* eslint-env jest */
import supertest from 'supertest';
import jwt from 'jsonwebtoken';

import { populateArticles } from '../../data/seed';

import { auth } from '../../../../config';

const request = supertest('http://localhost:3000');

describe('Search route', () => {
  beforeAll(populateArticles);

  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

  test('should redirect to Home if not location.search = ""', async () => {
    await request
      .get('/en/search')
      .expect('Location', '/en')
      .expect(302);
  });

  test('should redirect to Home if not location.search = "" if authenticated', async () => {
    await request
      .get('/search')
      .set('Cookie', `id_token=${token}`)
      .expect('Location', '/')
      .expect(302);
  });

  test('should redirect to Home if not q arg in search', async () => {
    await request
      .get('/en/search?m=articles')
      .expect('Location', '/en')
      .expect(302);
  });

  test('should redirect to Home if not q arg in search if authenticated', async () => {
    await request
      .get('/search?m=articles')
      .set('Cookie', `id_token=${token}`)
      .expect('Location', '/')
      .expect(302);
  });

  test('should return 404 error is spare slug if authenticated', async () => {
    await request
      .get('/search/lishiyslug?q=test&m=articles')
      .set('Cookie', `id_token=${token}`)
      .expect(404);
  });

  test('should return 404 error if there is spare slug', async () => {
    await request.get('/search/lishiyslug?q=test&m=content').expect(404);
  });

  test('should return 200 in content mode', async () => {
    await request.get('/search?q=test&m=content').expect(200);
  });

  test('should return 200 in content mode if authenticated', async () => {
    await request
      .get('/search?q=test&m=content')
      .set('Cookie', `id_token=${token}`)
      .expect(200);
  });

  test('should return 200 in article mode if authenticated', async () => {
    await request
      .get('/search?q=test&m=articles')
      .set('Cookie', `id_token=${token}`)
      .expect(200);
  });

  test('should redirect to /signin if not authenticated in articles mode', async () => {
    await request
      .get('/admin/articles/search?q=test')
      .expect('Location', '/signin')
      .expect(302);
  });

  test('should redirect to /en/signin if not authenticated in articles mode', async () => {
    await request
      .get('/en/admin/articles/search?q=test')
      .expect('Location', '/en/signin')
      .expect(302);
  });
});
