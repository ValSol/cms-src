/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { populateUsers } from '../../seed';
import { getUserModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');
let User;
describe('Mutation signout', () => {
  beforeAll(() => {
    getUserModel().then(result => {
      User = result;
    });
  });

  beforeEach(populateUsers);
  test('should signout and return user if user was signined', async () => {
    const name = 'signout';
    const user0 = await User.findOne({ email: 'example2@example.com' });
    const args = {};
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields, true);

    const user = {
      _id: user0._id,
      email: user0.email,
      role: user0.role,
    };
    const expiresIn = auth.jwt.expires;
    const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const setCookieHeader = response.headers['set-cookie'][0];
    // проверяем что токен в куках будет сброшен
    expect(setCookieHeader).toContain('id_token=; ');
    expect(setCookieHeader).toContain('Max-Age=-1; ');
    expect(setCookieHeader).toContain('; HttpOnly');
    const { _id, email, role } = response.body.data.signout;
    expect(_id).toBe(user0._id.toString());
    expect(email).toBe(user0.email);
    expect(role).toBe(user0.role);
  });
  test('should return user=null if user was not signined', async () => {
    const name = 'signout';
    const args = {};
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields, true);

    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    // проверяем что не был установлен кука с id_token
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeUndefined();
    const { signout } = response.body.data;
    expect(signout).toBeNull();
  });
});
