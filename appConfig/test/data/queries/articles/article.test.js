/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

// import jwt from 'jsonwebtoken';

import { populateArticles } from '../../seed';
import { getThingModel } from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

// import { auth } from '../../../config';

const request = supertest('http://localhost:3000');
describe('Article query', () => {
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
  test('should return article by subject, section and slug', async () => {
    const name = 'article';
    const article0 = await Article.findOne();
    const args = {
      subject: article0.subject[0],
      section: article0.section,
      slug: article0.slug,
    };
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

    const { article } = response.body.data;
    expect(article._id).toBe(article0._id.toString());
    expect(article._id).toBe(article0._id.toString());
    expect(article.title.uk).toBe(article0.title.uk);
    expect(article.title.ru).toBe(article0.title.ru);
    expect(article.title.en).toBe(article0.title.en);
  });

  test('should return article by id', async () => {
    const name = 'article';
    const article0 = await Article.findOne();
    const args = {
      _id: article0._id.toString(),
    };
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
    const { article } = response.body.data;
    expect(article._id).toBe(article0._id.toString());
    expect(article._id).toBe(article0._id.toString());
    expect(article.title.uk).toBe(article0.title.uk);
    expect(article.title.ru).toBe(article0.title.ru);
    expect(article.title.en).toBe(article0.title.en);
  });
  test('should return null for incorrect subject', async () => {
    const name = 'article';
    const article0 = await Article.findOne();
    const args = {
      subject: 'incorrect',
      section: article0.section,
      slug: article0.slug,
    };
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
    const { article } = response.body.data;
    expect(article).toBeNull();
  });
  test('should return null for incorrect section', async () => {
    const name = 'article';
    const article0 = await Article.findOne();
    const args = {
      subject: article0.subject[0],
      section: 'incorrect',
      slug: article0.slug,
    };
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
    const { article } = response.body.data;
    expect(article).toBeNull();
  });
  test('should return null for incorrect slug', async () => {
    const name = 'article';
    const article0 = await Article.findOne();
    const args = {
      subject: article0.subject[0],
      section: article0.section,
      slug: 'incorrect',
    };
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
    const { article } = response.body.data;
    expect(article).toBeNull();
  });
  test('should return null for incorrect _id', async () => {
    const name = 'article';
    const args = {
      _id: 'incorrect',
    };
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
    const { article } = response.body.data;
    expect(article).toBeNull();
  });
});
