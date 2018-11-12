/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateUsers } from '../../seed';
import { getUserModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

const request = supertest('http://localhost:3000');
describe('Query user', () => {
  let User;
  beforeAll(() => {
    getUserModel().then(result => {
      User = result;
    });
  });
  beforeEach(populateUsers);

  test('should return user by email', async () => {
    const name = 'user';
    const user0 = await User.findOne({ email: 'example2@example.com' });
    const args = {
      email: user0.email,
    };
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { _id, email, role } = response.body.data.user;
    expect(email).toBe(user0.email);
    expect(role).toBe(user0.role);
    expect(_id).toBe(user0._id.toString());
  });
  test('should not return user by incorrect email', async () => {
    const name = 'user';
    const args = {
      email: 'incorrect@email.com',
    };
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { user } = response.body.data;
    expect(user).toBeNull();
  });
  test('should return user by _id', async () => {
    const name = 'user';
    const user0 = await User.findOne({ email: 'example2@example.com' });
    const args = {
      _id: user0._id.toString(),
    };
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { _id, email, role } = response.body.data.user;
    expect(email).toBe(user0.email);
    expect(role).toBe(user0.role);
    expect(_id).toBe(user0._id.toString());
  });
  test('should not return user by incorrect _id', async () => {
    const name = 'user';
    const args = {
      _id: 'incorrect_id',
    };
    const fields = {
      _id: null,
      email: null,
      role: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { user } = response.body.data;
    expect(user).toBeNull();
  });
});
