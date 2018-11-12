/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateArticles } from '../../seed';
import { getExcerptModel } from '../../../../../data/mongooseModels';

const request = supertest('http://localhost:3000');

describe('populatedExcerpts query', () => {
  let Excerpt;
  const paramNames = '[\\"section\\",\\"subject\\"]';

  beforeAll(() => {
    getExcerptModel('Article').then(result => {
      Excerpt = result;
    });
  });
  beforeEach(populateArticles);
  test('should return populated excerpts for thingName: "Article" and subect: "patent"', async () => {
    const queryBody = JSON.stringify({
      query: `{
      populatedExcerpts(thingName: "Article", subject: "patent", paramNames: "${paramNames}") {
        _id
        subject
        items {
          ... on ArticleType {
            _id
            slug
            title {
              uk
            }
          }
        }
      }
    }`,
    });
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { populatedExcerpts } = response.body.data;
    expect(populatedExcerpts[0].subject).toBe('patent');
    expect(populatedExcerpts[1].subject).toBe('patent');

    const excerptsCount = await Excerpt.count({
      subject: 'patent',
    });
    expect(populatedExcerpts.length).toBe(excerptsCount);

    expect(populatedExcerpts[0].items.map(item => item.slug)).toEqual([
      '',
      'abc',
      'xyz',
    ]);
    expect(populatedExcerpts[1].items.map(item => item.slug)).toEqual(['']);
  });

  test('should return populated excerpts for thingName: "Article"', async () => {
    const queryBody = JSON.stringify({
      query: `{
      populatedExcerpts(thingName: "Article") {
        __typename
        items {
          ... on ArticleType {
            _id
            slug
            title {
              uk
            }
          }
        }
      }
    }`,
    });
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { populatedExcerpts } = response.body.data;

    const excerptsCount = await Excerpt.count({});
    expect(populatedExcerpts.length).toBe(excerptsCount);
  });
});
