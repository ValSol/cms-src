/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateArticles } from '../../seed';
import { getExcerptModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

const request = supertest('http://localhost:3000');

let Excerpt;

describe('Excerpt query', () => {
  beforeAll(() => {
    getExcerptModel('Article').then(result => {
      Excerpt = result;
    });
  });
  beforeEach(populateArticles);

  const name = 'excerpt';
  const args = {
    thingName: 'Article',
    subject: 'patent',
    section: 'info',
  };
  const fields = {
    subject: null,
    section: null,
    items: null,
  };
  test('should return excerpt', async () => {
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { excerpt } = response.body.data;
    expect(excerpt.subject).toBe(args.subject);
    expect(excerpt.section).toBe(args.section);

    const excerptFromBase = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });
    expect(excerpt.items.map(item => item.toString())).toEqual(
      excerptFromBase.items.map(item => item.toString()),
    );
  });
  test('should not retur excerpt 1', async () => {
    args.subject = 'copyright';
    args.section = 'services';
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    expect(response.body.data.excerpt).toBeNull();
  });
});
