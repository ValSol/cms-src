/* eslint-env jest */
import supertest from 'supertest';

import { populateArticles } from '../../test/data/seed';

const request = supertest('http://localhost:3000');

describe('Article route', () => {
  beforeEach(populateArticles);

  test('should return 200 and title in text for content', async () => {
    const response = await request.get('/patent/info/abc').expect(200);
    expect(response.text).toContain('>abc - дуже довга назва</h1>');
  });

  test('should return 404 if no content', async () => {
    await request.get('/patent/info/abcde').expect(404);
  });
});
