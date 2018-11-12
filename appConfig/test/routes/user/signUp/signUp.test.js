/* eslint-env jest */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

describe('SignUp route', () => {
  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

  test('should return 200 and signup (in ukraine) form for unathenticated user', async () => {
    const response = await request.get('/signup').expect(200);
    expect(response.text).toContain('Реєстрація на Intellect.UA');
  });
  test('should return 200 and signup (in english) form for unathenticated user', async () => {
    const response = await request.get('/en/signup').expect(200);
    expect(response.text).toContain('Registration on Intellect.ua');
  });
  test('should redirect to home for athenticated user', async () => {
    await request
      .get('/en/signup')
      .set('Cookie', `id_token=${token}`)
      .expect('Location', '/en')
      .expect(302);
  });
  test('should return 404 for needless url (authenticated user)', async () => {
    await request
      .get('/signup/needless-slug')
      .set('Cookie', `id_token=${token}`)
      .expect(404);
  });
  test('should return 404 for for needless url (unauthenticated user)', async () => {
    await request.get('/signup/needless-slug').expect(404);
  });
});
