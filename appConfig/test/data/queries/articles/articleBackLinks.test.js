/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

// import jwt from 'jsonwebtoken';

import { populateArticles } from '../../seed';
import { getThingModel } from '../../../../../data/mongooseModels';

// import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

const coerceArray = arr => JSON.parse(JSON.stringify(arr));

describe('articleBackLinks query', () => {
  let Article;
  beforeAll(() => {
    const promises = [];
    promises.push(
      getThingModel('Article').then(result => {
        Article = result;
      }),
    );
  });
  beforeEach(populateArticles);
  /*
  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  */
  test('should return empty backLinks array', async () => {
    const articles = await Article.find();
    const { _id } = articles[0];
    const queryBody = JSON.stringify({
      query: `{
      articleBackLinks(_id: "${_id}") {
        ... on ArticleType {
          _id
          slug
        }
      }
    }`,
    });
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { articleBackLinks } = response.body.data;
    expect(articleBackLinks).toEqual([]);
  });

  test('should return NOT empty backLinks array', async () => {
    const articles = await Article.find();
    const { _id } = articles[0];
    const {
      _id: id1,
      slug: slug1,
      section: section1,
      subject: subject1,
    } = articles[1];
    const {
      _id: id2,
      slug: slug2,
      section: section2,
      subject: subject2,
    } = articles[2];
    const upsert1 = {
      $addToSet: { backLinks: { item: id1, itemThingName: 'Article' } },
    };
    const upsert2 = {
      $addToSet: { backLinks: { item: id2, itemThingName: 'Article' } },
    };
    await Article.findByIdAndUpdate(_id, upsert1);
    await Article.findByIdAndUpdate(_id, upsert2);
    const article = await Article.findById(_id);
    expect(article.backLinks.length).toBe(2);
    const queryBody = JSON.stringify({
      query: `{
      articleBackLinks(_id: "${_id}") {
        ... on ArticleType {
          _id
          slug
          section
          subject
        }
      }
    }`,
    });
    const response = await request
      .post('/graphql')
      // .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { articleBackLinks } = response.body.data;
    expect(articleBackLinks.length).toEqual(2);
    const backLink0 = articleBackLinks[0];
    expect(backLink0.slug).toBe(slug1);
    expect(backLink0.section).toBe(section1);
    expect(coerceArray(backLink0.subject)).toEqual(coerceArray(subject1));
    const backLink1 = articleBackLinks[1];
    expect(backLink1.slug).toBe(slug2);
    expect(backLink1.section).toBe(section2);
    expect(coerceArray(backLink1.subject)).toEqual(coerceArray(subject2));
  });
});
