/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

import { populateArticles } from '../../seed';
import {
  getExcerptModel,
  getTextIndex,
  getThingModel,
} from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

import { auth } from '../../../../../config';

const request = supertest('http://localhost:3000');

describe('articlesStatus query', () => {
  let Article;
  let Excerpt;
  let UkTextIndex;
  beforeAll(() => {
    const promises = [];
    promises.push(
      getThingModel('Article').then(result => {
        Article = result;
      }),
    );
    promises.push(
      getExcerptModel('Article').then(result => {
        Excerpt = result;
      }),
    );
    promises.push(
      getTextIndex('Article', 'uk').then(result => {
        UkTextIndex = result;
      }),
    );
  });
  beforeEach(populateArticles);
  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  test('should return zerro errors', async () => {
    const name = 'articlesStatus';
    const args = {};
    const fields = {
      excerptErrors: null,
      textIndexErrors: null,
      backLinksErrors: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const {
      articlesStatus: { excerptErrors, textIndexErrors, backLinksErrors },
    } = response.body.data;
    expect(excerptErrors).toBe(0);
    expect(textIndexErrors).toBe(0);
    expect(backLinksErrors).toBe(0);
  });
  test('should return errors', async () => {
    // вносим искуственные ошибки в БД
    const excerptCount = await Excerpt.count();
    const textIndexCount = await UkTextIndex.count();
    await Excerpt.remove();
    await UkTextIndex.remove();
    const name = 'articlesStatus';
    const args = {};
    const fields = {
      excerptErrors: null,
      textIndexErrors: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const {
      articlesStatus: { excerptErrors, textIndexErrors },
    } = response.body.data;
    expect(excerptErrors).toBe(excerptCount);
    expect(textIndexErrors).toBe(textIndexCount);
  });

  test('should return errors 2', async () => {
    // сначала добавляем новую публикацию в которую внесем изменения
    const ukRichTextObj = {
      entityMap: {},
      blocks: [
        { text: 'Контент українською' },
        { text: 'строка 2' },
        { text: 'строка 3' },
      ],
    };
    const ruRichTextObj = {
      entityMap: {},
      blocks: [
        { text: 'Контент по русски' },
        { text: 'строка 2' },
        { text: 'строка 3' },
      ],
    };
    const enRichTextObj = {
      entityMap: {},
      blocks: [
        { text: 'Content in English' },
        { text: 'line 2' },
        { text: 'line 3' },
      ],
    };
    const content = {
      uk: JSON.stringify(ukRichTextObj),
      ru: JSON.stringify(ruRichTextObj),
      en: JSON.stringify(enRichTextObj),
    };
    const name = 'addArticle';
    const articles = await Article.find();
    const { _id: id0 } = articles[0];
    const { _id: id1 } = articles[1];
    const content2 = {
      ...content,
      uk: JSON.stringify({
        entityMap: {
          0: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info',
              _id: id0.toString(),
              thingName: 'Article',
            },
          },
          1: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info/abc',
              _id: id1.toString(),
              thingName: 'Article',
            },
          },
        },
        blocks: [
          { text: 'Контент українською' },
          { text: 'строка 2' },
          { text: 'строка 3' },
        ],
      }),
    };
    const args = {
      subject: ['trademark', 'copyright'],
      section: 'services',
      slug: 'abcplus',
      title: {
        uk: 'українською',
        ru: 'по русски',
        en: 'in inglish',
      },
      shortTitle: {
        uk: 'укр',
        ru: 'по рус',
        en: 'in ing',
      },
      content: content2,
    };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
      shortTitle: {
        uk: null,
        ru: null,
        en: null,
      },
      content: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { addArticle } = response.body.data;

    const { _id } = addArticle;
    // проверяем что были добавлены backLinks
    const article0 = await Article.findById(id0);
    expect(article0.backLinks.length).toBe(1);
    expect(article0.backLinks[0].itemThingName).toBe('Article');
    expect(article0.backLinks[0].item.toString()).toBe(_id.toString());
    const article1 = await Article.findById(id1);
    expect(article1.backLinks.length).toBe(1);
    expect(article1.backLinks[0].itemThingName).toBe('Article');
    expect(article1.backLinks[0].item.toString()).toBe(_id.toString());
    // вносим искуственные ошибки в БД

    await Article.findByIdAndRemove(_id);

    const name2 = 'articlesStatus';
    const args2 = {};
    const fields2 = {
      excerptErrors: null,
      textIndexErrors: null,
      backLinksErrors: null,
    };
    const queryBody2 = objectsToQueryBody(name2, args2, fields2);
    const response2 = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody2)
      .expect(200);

    const {
      articlesStatus: { excerptErrors, textIndexErrors, backLinksErrors },
    } = response2.body.data;
    expect(excerptErrors).toBe(2);
    expect(textIndexErrors).toBe(3);
    expect(backLinksErrors).toBe(2);
  });

  test('should return null for unathorized request', async () => {
    const name = 'articlesStatus';
    const args = {};
    const fields = {
      excerptErrors: null,
      textIndexErrors: null,
    };
    const queryBody = objectsToQueryBody(name, args, fields);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    expect(response.body.data.articlesStatus).toBeNull();
  });
});
