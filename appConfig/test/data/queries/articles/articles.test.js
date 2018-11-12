/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

// import jwt from 'jsonwebtoken';

import { populateArticles } from '../../seed';
import { getThingModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

// import { auth } from '../../../config';

const request = supertest('http://localhost:3000');

describe('Articles query', () => {
  let Article;
  beforeAll(() => {
    getThingModel('Article').then(result => {
      Article = result;
    });
  });
  beforeEach(populateArticles);
  // const user = { email: 'example@example.com', _id: '1111111111111', role: 'admin' };
  // const expiresIn = auth.jwt.expires;
  // const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  test('should return all article', async () => {
    const name = 'articles';
    const args = {};
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find();
    expect(articles.length).toBe(allArticles.length);
    expect(articles[0]._id.toString()).toBe(allArticles[0]._id.toString());
    expect(articles[0].title.uk).toBe(allArticles[0].title.uk);
    expect(articles[1]._id.toString()).toBe(allArticles[1]._id.toString());
    expect(articles[1].title.uk).toBe(allArticles[1].title.uk);
    expect(articles[2]._id.toString()).toBe(allArticles[2]._id.toString());
    expect(articles[2].title.uk).toBe(allArticles[2].title.uk);
    expect(articles[3]._id.toString()).toBe(allArticles[3]._id.toString());
    expect(articles[3].title.uk).toBe(allArticles[3].title.uk);
  });
  test('should return articles wich have subject = "patent"', async () => {
    const name = 'articles';
    const args = { subject: 'patent' };
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find({ subject: 'patent' });
    expect(articles.length).toBe(allArticles.length);
  });
  test('should return articles wich have subject = "design"', async () => {
    const name = 'articles';
    const args = { subject: 'design' };
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find({ subject: 'design' });
    expect(articles.length).toBe(allArticles.length);
  });
  test('should return articles wich have section = "info"', async () => {
    const name = 'articles';
    const args = { section: 'info' };
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find({ section: 'info' });
    expect(articles.length).toBe(allArticles.length);
  });
  test('should return articles wich have subject = "patent", section = "info"', async () => {
    const name = 'articles';
    const args = { subject: 'patent', section: 'info' };
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find({
      subject: 'patent',
      section: 'info',
    });
    expect(articles.length).toBe(allArticles.length);
  });
  test('should return all articles', async () => {
    const name = 'articles';
    const args = {};
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    const allArticles = await Article.find();
    expect(articles.length).toBe(allArticles.length);
  });
  test('should return array with one element for subject = "copyright"', async () => {
    const name = 'articles';
    const args = { subject: 'copyright' };
    const fields = {
      _id: null,
      shortTitle: {
        uk: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    const { articles } = response.body.data;
    expect(articles.length).toBe(1);
  });
});
