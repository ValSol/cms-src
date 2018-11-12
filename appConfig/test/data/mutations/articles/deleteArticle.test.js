/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import Promise from 'bluebird';
import supertest from 'supertest';

import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';

import { populateArticles } from '../../seed';
import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../../../../data/mongooseModels';
import { objectsToQueryBody } from '../../../../../core/utils';

import { auth } from '../../../../../config';

let Article;
let Excerpt;
let UkTextIndex;
let RuTextIndex;
let EnTextIndex;

const request = supertest('http://localhost:3000');

describe('Delete Article mutation', () => {
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
    promises.push(
      getTextIndex('Article', 'ru').then(result => {
        RuTextIndex = result;
      }),
    );
    promises.push(
      getTextIndex('Article', 'en').then(result => {
        EnTextIndex = result;
      }),
    );

    return Promise.all(promises);
  });

  beforeEach(populateArticles);

  const user = {
    email: 'example@example.com',
    _id: '1111111111111',
    role: 'admin',
  };
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

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

  const args = {
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
    content,
  };

  test('should remove article article from db', async () => {
    const name = 'deleteArticle';
    const articles = await Article.find();
    const aritclesCount = articles.length;

    const _id = articles[0]._id.toString();
    const id1 = articles[1]._id.toString();
    const id2 = articles[2]._id.toString();
    const id3 = articles[3]._id.toString();
    const upsert0 = {
      $addToSet: { backLinks: { item: _id, itemThingName: 'Article' } },
    };
    const upsert3 = {
      $addToSet: { backLinks: { item: id3, itemThingName: 'Article' } },
    };
    await Article.findByIdAndUpdate(id1, upsert0);
    await Article.findByIdAndUpdate(id1, upsert3);
    await Article.findByIdAndUpdate(id2, upsert3);
    await Article.findByIdAndUpdate(id2, upsert0);
    const articlePre1 = await Article.findById(id1);
    expect(articlePre1.backLinks.length).toBe(2);
    const articlePre2 = await Article.findById(id2);
    expect(articlePre2.backLinks.length).toBe(2);
    const content2 = {
      ...content,
      uk: JSON.stringify({
        entityMap: {
          0: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info',
              _id: id1.toString(),
              thingName: 'Article',
            },
          },
          1: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info/abc',
              _id: id2.toString(),
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
    const args2 = {
      ...args,
      _id,
      content: content2,
    };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { deleteArticle } = response.body.data;

    expect(deleteArticle._id.toString()).toBe(articles[0]._id.toString());
    expect(deleteArticle.title.uk).toBe(articles[0].title.uk);
    expect(deleteArticle.title.ru).toBe(articles[0].title.ru);
    expect(deleteArticle.title.en).toBe(articles[0].title.en);

    const count = await Article.count({});
    expect(count).toBe(aritclesCount - 1);

    const excerpt = await Excerpt.findOne({
      subject: articles[0].subject[0],
      section: articles[0].section,
    });
    // из существующего документ убирается ссылка на удаленную ссылку
    const { items } = excerpt;
    expect(items.length).toBe(2);
    // удаляются документы с текстовыми индексами
    const ukTextIndexCount = await UkTextIndex.count({});
    expect(ukTextIndexCount).toBe(aritclesCount - 1);
    const ruTextIndexCount = await RuTextIndex.count({});
    expect(ruTextIndexCount).toBe(aritclesCount - 1);
    const enTextIndexCount = await EnTextIndex.count({});
    expect(enTextIndexCount).toBe(aritclesCount - 1);

    // проверяем backLinks в документах на которые были ссылки
    const article1 = await Article.findById(id1);
    expect(article1.backLinks.length).toBe(1);
    expect(article1.backLinks[0].itemThingName).toBe('Article');
    expect(article1.backLinks[0].item.toString()).toBe(id3);
    const article2 = await Article.findById(id2);
    expect(article2.backLinks.length).toBe(1);
    expect(article2.backLinks[0].itemThingName).toBe('Article');
    expect(article2.backLinks[0].item.toString()).toBe(id3);
  });
  test('should remove article article & excerpt from db', async () => {
    const name = 'deleteArticle';
    const aritclesCount = await Article.count({});
    // находим выборки в которые ссылаются только на одну aritcle
    const excerpts = await Excerpt.find({ items: { $size: 1 } });
    // и получаем 1) id одной из таких aritcle
    const id = excerpts[0].items[0].toString();
    // и 2) саму эту article
    const articleForTest = await Article.findById(id);
    const args2 = { ...args, _id: id };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { deleteArticle } = response.body.data;
    expect(deleteArticle._id.toString()).toBe(id);
    expect(deleteArticle.title.uk).toBe(articleForTest.title.uk);
    expect(deleteArticle.title.ru).toBe(articleForTest.title.ru);
    expect(deleteArticle.title.en).toBe(articleForTest.title.en);

    const count = await Article.count({});
    expect(count).toBe(aritclesCount - 1);

    const excerpt = await Excerpt.findOne({
      subject: articleForTest.subject[0],
      section: articleForTest.section,
    });
    expect(excerpt).toBeNull();
  });
  test('should remove article article & 2 excerpts from db', async () => {
    const name = 'deleteArticle';
    const aritclesCount = await Article.count({});
    // находим публикацию у которой присутствует 2 значения subject
    const articleForTest = await Article.findOne({ slug: 'xxx' });
    // и получаем 1) id одной из таких aritcle
    const preExcerpt = await Excerpt.findOne({
      subject: articleForTest.subject[0],
      section: articleForTest.section,
    });
    const itemsCount = preExcerpt.items.length;
    const preExcerpt2 = await Excerpt.findOne({
      subject: articleForTest.subject[1],
      section: articleForTest.section,
    });
    const itemsCount2 = preExcerpt2.items.length;
    const _id = articleForTest.toObject()._id.toString();
    // и 2) саму эту article
    const args2 = { ...args, _id };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { deleteArticle } = response.body.data;
    expect(deleteArticle._id.toString()).toBe(_id);
    expect(deleteArticle.title.uk).toBe(articleForTest.title.uk);
    expect(deleteArticle.title.ru).toBe(articleForTest.title.ru);
    expect(deleteArticle.title.en).toBe(articleForTest.title.en);

    const count = await Article.count({});
    expect(count).toBe(aritclesCount - 1);

    const excerpt = await Excerpt.findOne({
      subject: articleForTest.subject[0],
      section: articleForTest.section,
    });
    if (itemsCount > 1) {
      expect(excerpt.items.length).toBe(itemsCount - 1);
    } else {
      expect(excerpt).toBeNull();
    }
    expect(excerpt).toBeNull();
    const excerpt2 = await Excerpt.findOne({
      subject: articleForTest.subject[1],
      section: articleForTest.section,
    });
    if (itemsCount2 > 1) {
      expect(excerpt2.items.length).toBe(itemsCount2 - 1);
    } else {
      expect(excerpt2).toBeNull();
    }
  });
  test('should return null for nonexisting article', async () => {
    const aritclesCount = await Article.count({});
    const name = 'deleteArticle';
    const args2 = {
      ...args,
      _id: ObjectID().toString(),
    };
    const fields = {
      _id: null,
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    // ничего не удаляется
    expect(response.body.data.deleteArticle).toBeNull();
    // количество публикаций не изменяется
    const count = await Article.count({});
    expect(count).toBe(aritclesCount);
  });
  test('should return null for article with not empty backLinks array', async () => {
    const articles = await Article.find();
    const aritclesCount = articles.length;
    const { _id } = articles[0];
    const { _id: id1 } = articles[1];
    const { _id: id2 } = articles[2];
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
    const name = 'deleteArticle';
    const args2 = { ...args, _id: _id.toString() };
    const fields = {
      _id: null,
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);
    // ничего не удаляется
    expect(response.body.data.deleteArticle).toBeNull();
    // количество публикаций не изменяется
    const count = await Article.count({});
    expect(count).toBe(aritclesCount);
  });
  test('should return null for unathorized request', async () => {
    const name = 'deleteArticle';
    const articles = await Article.find();
    const aritclesCount = articles.length;
    const _id = articles[0]._id.toString();
    const args2 = { _id, ...args };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args2, fields, true);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    expect(response.body.data.deleteArticle).toBeNull();
    // количество публикаций не изменяется
    const count = await Article.count({});
    expect(count).toBe(aritclesCount);
  });
});
