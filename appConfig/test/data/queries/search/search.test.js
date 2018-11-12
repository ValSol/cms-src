/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import { populateArticles } from '../../seed';

const request = supertest('http://localhost:3000');

describe('Search query', () => {
  beforeEach(populateArticles);

  test('should return exact query search results for correct locale', async () => {
    const queryBody = JSON.stringify({
      query: `{
      search(thingName: "Article", query: "тестування пошуку", locale: uk) {
        ... on ArticleType {
          _id
          score
          title { uk }
          content { uk }
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
    const { search } = response.body.data;
    expect(search.length).toBe(2);
    expect(search[0].title.uk).toContain('(тестування пошуку)');
    expect(search[1].content.uk).toContain('тестування пошуку');
  });

  test('should return search (without exact frase) results for correct locale', async () => {
    const queryBody = JSON.stringify({
      query: `{
      search(thingName: "Article", query: "тестування, пошуку", locale: uk) {
        ... on ArticleType {
          _id
          score
          title { uk }
          content { uk }
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
    const { search } = response.body.data;
    expect(search.length).toBe(3);
    expect(search[0].title.uk).toContain('(тестування пошуку)');
    expect(search[1].content.uk).toContain('тестування пошуку');
    expect(search[2].content.uk).toContain('тестування дуже нечіткого пошуку');
  });

  test('should return search (only exact frase) results for correct locale', async () => {
    const queryBody = JSON.stringify({
      query: `{
      search(thingName: "Article", query: "\\"тестування, пошуку\\"", locale: uk) {
        ... on ArticleType {
          _id
          score
          title { uk }
          content { uk }
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
    const { search } = response.body.data;
    expect(search.length).toBe(0);
  });

  test('should return empty results for incorrect locale', async () => {
    const queryBody = JSON.stringify({
      query: `{
      search(thingName: "Article", query: "тестування, пошуку", locale: ru) {
        ... on ArticleType {
          _id
          score
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
    const { search } = response.body.data;
    expect(search.length).toBe(0);
  });
});
