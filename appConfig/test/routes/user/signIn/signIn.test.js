/* eslint-env jest */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

describe('SignIn route', () => {
  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

  test('should return 200 and signin (in ukraine) form for unathenticated user', async () => {
    const response = await request.get('/signin').expect(200);
    expect(response.text).toContain('Вхід в панель керування');
  });
  test('should return 200 and signin (in english) form for unathenticated user', async () => {
    const response = await request.get('/en/signin').expect(200);
    expect(response.text).toContain('The entrance to the control panel');
  });
  test('should redirect to home for athenticated user', async () => {
    await request
      .get('/en/signin')
      .set('Cookie', `id_token=${token}`)
      .expect('Location', '/en')
      .expect(302);
  });
  test('should return 404 for needless url (authenticated user)', async () => {
    await request
      .get('/signin/needless-slug')
      .set('Cookie', `id_token=${token}`)
      .expect(404);
  });
  test('should return 404 for for needless url (unauthenticated user)', async () => {
    await request.get('/signin/needless-slug').expect(404);
  });
});
