/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { populateArticles } from '../../seed';
import { getExcerptModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

let Excerpt;

describe('Update Excerpt mutation', () => {
  beforeAll(() => {
    getExcerptModel('Article').then(result => {
      Excerpt = result;
    });
  });
  beforeEach(populateArticles);

  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  const name = 'updateExcerpt';
  const args = {
    thingName: 'Article',
    subject: 'patent',
    section: 'info',
  };
  const fields = {
    items: null,
    _id: null,
  };

  test('should update excerpt in db', async () => {
    const excerpt = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    const [item0, item1, item2] = excerpt.items.map(item => item.toString());
    args.items = [item1, item2, item0];
    const queryBody = objectsToQueryBody(name, args, fields, true);

    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { updateExcerpt } = await response.body.data;

    expect(updateExcerpt.items).toEqual(args.items);

    const excerptFromDB = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    expect(updateExcerpt.items.map(item => item.toString())).toEqual(
      excerptFromDB.items.map(item => item.toString()),
    );
  });
  test('should update excerpt in db getting by _id', async () => {
    const excerpt = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    const [item0, item1, item2] = excerpt.items.map(item => item.toString());
    const args2 = {
      thingName: 'Article',
      _id: excerpt._id.toString(),
      items: [item1, item2, item0],
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);

    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { updateExcerpt } = await response.body.data;

    expect(updateExcerpt.items).toEqual(args.items);

    const excerptFromDB = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    expect(updateExcerpt.items.map(item => item.toString())).toEqual(
      excerptFromDB.items.map(item => item.toString()),
    );
  });
  test('should not update excerpt in db if another ids', async () => {
    args.items = ['1111111111', '22222222222', '9999999999999'];
    const queryBody = objectsToQueryBody(name, args, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody);
    expect(response.body.data.updateExcerpt).toBeNull();
  });
  test('should return null for unathorized request', async () => {
    const excerpt = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    const [item0, item1, item2] = excerpt.items.map(item => item.toString());
    args.items = [item1, item2, item0];
    const queryBody = objectsToQueryBody(name, args, fields, true);

    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    expect(response.body.data.updateExcerpt).toBeNull();
  });
});
