/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

describe('SignOut route', () => {
  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

  test('should redirect to home for authenticated user', async () => {
    await request
      .get('/en/signout')
      .set('Cookie', `id_token=${token}`)
      .expect('Location', '/en')
      .expect(302);
  });
  test('should redirect to home for unauthenticated user', async () => {
    await request
      .get('/en/signout')
      .expect('Location', '/en')
      .expect(302);
  });
  test('should return 404 for needless url (authenticated user)', async () => {
    await request
      .get('/signout/needless-slug')
      .set('Cookie', `id_token=${token}`)
      .expect(404);
  });
  test('should return 404 for for needless url (unauthenticated user)', async () => {
    await request.get('/signin/needless-slug').expect(404);
  });
});
