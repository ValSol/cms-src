/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateArticles } from '../../seed';
import { getExcerptModel } from '../../../../../data/mongooseModels';

const request = supertest('http://localhost:3000');

let Excerpt;

describe('populatedExcerpt query', () => {
  beforeAll(() => {
    getExcerptModel('Article').then(result => {
      Excerpt = result;
    });
  });
  beforeEach(populateArticles);
  test('should return populated excerpt', async () => {
    const queryBody = JSON.stringify({
      query: `{
      populatedExcerpt(thingName: "Article", subject: "patent", section: "info") {
        subject
        section
        items {
          ... on ArticleType {
            _id
            slug
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

    const { populatedExcerpt } = response.body.data;
    expect(populatedExcerpt.subject).toBe('patent');
    expect(populatedExcerpt.section).toBe('info');

    const excerpt = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });

    expect(populatedExcerpt.items.map(item => item._id.toString())).toEqual(
      excerpt.items.map(item => item.toString()),
    );
    const expectedSlugs = ['', 'abc', 'xyz'];
    expect(populatedExcerpt.items.map(({ slug }) => slug)).toEqual(
      expectedSlugs,
    );
  });
});
