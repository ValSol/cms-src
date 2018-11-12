/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateUsers } from '../../seed';
import { getUserModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

const request = supertest('http://localhost:3000');
describe('Mutation signin', () => {
  let User;
  beforeAll(() => {
    getUserModel().then(result => {
      User = result;
    });
  });

  beforeEach(populateUsers);

  test('signin with right email and password', async () => {
    const name = 'signin';
    const user = await User.findOne({ email: 'example2@example.com' });
    const args = {
      email: user.email,
      password: '1234567890',
    };
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

    const setCookieHeader = response.headers['set-cookie'][0];
    expect(setCookieHeader).toContain('id_token=');
    expect(setCookieHeader).toContain('; HttpOnly');
    const { _id, email, role } = response.body.data.signin;
    expect(_id).toBe(user._id.toString());
    expect(email).toBe(user.email);
    expect(role).toBe(user.role);
  });
  test('should not signin if not correct email', async () => {
    const name = 'signin';
    const args = {
      email: 'incorrect@example.com',
      password: '1234567890',
    };
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
    expect(response.body.data.signin).toBeNull();
  });
  test('should not signin if not correct password', async () => {
    const name = 'signin';
    const user = await User.findOne({ email: 'example2@example.com' });
    const args = {
      email: user.email,
      password: 'incorrect',
    };
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
    expect(response.body.data.signin).toBeNull();
  });
  test('should not signin if not correct email and password', async () => {
    const name = 'signin';
    const args = {
      email: 'incorrec@email.com',
      password: 'incorrect',
    };
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
    expect(response.body.data.signin).toBeNull();
  });
});
