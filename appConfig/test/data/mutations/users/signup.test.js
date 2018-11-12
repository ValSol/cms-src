/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateUsers } from '../../seed';
import { getUserModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

import {
  admin as adminRole,
  customer as customerRole,
} from '../../../../../core/rbac/roles';

const request = supertest('http://localhost:3000');
let User;
describe('Mutation signup', () => {
  beforeAll(() => {
    getUserModel().then(result => {
      User = result;
    });
  });

  beforeEach(populateUsers);
  test('should add new user to db', async () => {
    const name = 'signup';
    const args = {
      email: 'example@example.com',
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
    const { email, role, _id } = response.body.data.signup;
    expect(email).toBe('example@example.com');
    expect(role).toBe(customerRole);
    const user = await User.findById(_id);
    expect(user.email).toBe('example@example.com');
    expect(user.role).toBe(customerRole);
  });
  test('should add user as admin to db', async () => {
    const name = 'signup';
    const args = {
      email: 'v.solovyov@intellect.ua',
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
    const { email, role, _id } = response.body.data.signup;
    expect(email).toBe('v.solovyov@intellect.ua');
    expect(role).toBe(adminRole);
    const user = await User.findById(_id);
    expect(user.email).toBe('v.solovyov@intellect.ua');
    expect(user.role).toBe(adminRole);
  });
  test('should not add new user to db if not unique email', async () => {
    const name = 'signup';
    const args = {
      email: 'example2@example.com',
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
    const user = response.body.data.signup;
    expect(user).toBeNull();
    const count = await User.count({});
    expect(count).toBe(2);
  });
});
