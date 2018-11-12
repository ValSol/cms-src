/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

// import jwt from 'jsonwebtoken';

import { getThingModel } from '../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../core/utils';

// import { auth } from '../../../config';

const request = supertest('http://localhost:3000');
describe('thingName query', () => {
  // const user = { email: 'example@example.com', _id: '1111111111111', role: 'admin' };
  // const expiresIn = auth.jwt.expires;
  // const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  test('should return thingName for "Article" id', async () => {
    const Thing = await getThingModel('Article');
    const name = 'thingName';
    const thing = await Thing.findOne({}, { _id: 1 });
    const args = { _id: thing._id.toString() };
    const queryBody = objectsToQueryBody(name, args);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { thingName } = response.body.data;
    expect(thingName).toBe('Article');
  });
  test('should return thingName for "Service" id', async () => {
    const Thing = await getThingModel('Service');
    const name = 'thingName';
    const thing = await Thing.findOne({}, { _id: 1 });
    const args = { _id: thing._id.toString() };
    const queryBody = objectsToQueryBody(name, args);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { thingName } = response.body.data;
    expect(thingName).toBe('Service');
  });
  test('should return null for nonexistent id', async () => {
    const name = 'thingName';
    const args = { _id: '5ade3eff9dacf81a6c6fea3a' };
    const queryBody = objectsToQueryBody(name, args);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { thingName } = response.body.data;
    expect(thingName).toBe(null);
  });
});
