/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateArticles } from '../../seed';
import { getExcerptModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

let Excerpt;

const request = supertest('http://localhost:3000');

describe('Excerpts query', () => {
  beforeAll(() => {
    getExcerptModel('Article').then(result => {
      Excerpt = result;
    });
  });
  beforeEach(populateArticles);

  const name = 'excerpts';
  const args = {
    thingName: 'Article',
  };
  const fields = {
    subject: null,
    section: null,
    items: null,
  };
  test('should return all excerpts', async () => {
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { excerpts } = response.body.data;

    const excerptsFromBase = await Excerpt.find();
    expect(excerpts.length).toBe(excerptsFromBase.length);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].items.map(item => item.toString())).toEqual(
      excerptsFromBase[0].items.map(item => item.toString()),
    );
  });

  test('should return excerpts for only paramaNames as arg for search', async () => {
    args.paramNames = JSON.stringify(['section', 'subject']);
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { excerpts } = response.body.data;

    const excerptsFromBase = await Excerpt.find({
      paramNames: args.paramNames,
    });
    expect(excerpts.length).toBe(excerptsFromBase.length);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].items.map(item => item.toString())).toEqual(
      excerptsFromBase[0].items.map(item => item.toString()),
    );
  });

  test('should return excerpts for subject="patent" as arg for search', async () => {
    args.subject = 'patent';
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { excerpts } = response.body.data;

    const excerptsFromBase = await Excerpt.find({
      paramNames: args.paramNames,
      subject: args.subject,
    });
    expect(excerpts.length).toBe(excerptsFromBase.length);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].subject).toBe(excerptsFromBase[0].subject);
    expect(excerpts[0].items.map(item => item.toString())).toEqual(
      excerptsFromBase[0].items.map(item => item.toString()),
    );
  });
});
