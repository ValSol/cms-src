/* eslint-env jest */
import supertest from 'supertest';

const request = supertest('http://localhost:3000');

describe('notFound route', () => {
  test('should return 404 and text for content', async () => {
    await request.get('/patent2/info/abc').expect(404);
  });
  test('should return 404 and text in english for content', async () => {
    await request.get('/en/patent2/info/abc').expect(404);
  });
});
