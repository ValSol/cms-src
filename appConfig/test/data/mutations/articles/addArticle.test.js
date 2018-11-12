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

// вспомогательная функция приводящая возвращаемые данные типа array ...
// ... к обыкновенному массиву чтобы срабатывал метод toEqual
const coerceArray = arr => JSON.parse(JSON.stringify(arr));

describe('Add Article mutation', () => {
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

  const contentIndex = {
    uk: 'Контент українською\nстрока 2\nстрока 3',
    ru: 'Контент по русски\nстрока 2\nстрока 3',
    en: 'Content in English\nline 2\nline 3',
  };

  test('should add article in db', async () => {
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
    expect(addArticle.title).toEqual(args.title);
    expect(addArticle.shortTitle).toEqual(args.shortTitle);
    expect(addArticle.content).toEqual(args.content);

    const { _id } = addArticle;

    const article = await Article.findById(_id);
    expect(coerceArray(article.subject)).toEqual(args.subject);
    expect(article.section).toBe(args.section);
    expect(article.slug).toBe(args.slug);
    expect(article.title.uk).toBe(args.title.uk);
    expect(article.title.ru).toBe(args.title.ru);
    expect(article.title.en).toBe(args.title.en);
    expect(article.shortTitle.uk).toBe(args.shortTitle.uk);
    expect(article.shortTitle.ru).toBe(args.shortTitle.ru);
    expect(article.shortTitle.en).toBe(args.shortTitle.en);
    expect(article.content.uk).toBe(args.content.uk);
    expect(article.content.ru).toBe(args.content.ru);
    expect(article.content.en).toBe(args.content.en);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    const excerpt2 = await Excerpt.findOne({
      subject: args.subject[1],
      section: args.section,
    });
    // создаются выборки с указанием на ранее созданную публикацию
    expect(excerpt.items[0].toString()).toBe(_id.toString());
    expect(excerpt2.items[0].toString()).toBe(_id.toString());

    const ukTextIndex = await UkTextIndex.findOne({ _item: _id });
    expect(ukTextIndex.title).toBe(args.title.uk);
    expect(ukTextIndex.content).toBe(contentIndex.uk);

    const ruTextIndex = await RuTextIndex.findOne({ _item: _id });
    expect(ruTextIndex.title).toBe(args.title.ru);
    expect(ruTextIndex.content).toBe(contentIndex.ru);

    const enTextIndex = await EnTextIndex.findOne({ _item: _id });
    expect(enTextIndex.title).toBe(args.title.en);
    expect(enTextIndex.content).toBe(contentIndex.en);

    // проверяем что были добавлены backLinks
    const article0 = await Article.findById(id0);
    expect(article0.backLinks.length).toBe(1);
    expect(article0.backLinks[0].itemThingName).toBe('Article');
    expect(article0.backLinks[0].item.toString()).toBe(_id.toString());
    const article1 = await Article.findById(id1);
    expect(article1.backLinks.length).toBe(1);
    expect(article1.backLinks[0].itemThingName).toBe('Article');
    expect(article1.backLinks[0].item.toString()).toBe(_id.toString());
  });

  test('should add article in db with same subject & section', async () => {
    const name = 'addArticle';
    const args = {
      subject: ['patent'],
      section: 'info',
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
      content,
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
    expect(addArticle.title).toEqual(args.title);
    expect(addArticle.shortTitle).toEqual(args.shortTitle);
    expect(addArticle.content).toEqual(args.content);

    const article = await Article.findById(addArticle._id);
    expect(article.slug).toBe(args.slug);
    expect(article.title.uk).toBe(args.title.uk);
    expect(article.title.ru).toBe(args.title.ru);
    expect(article.title.en).toBe(args.title.en);
    expect(article.shortTitle.uk).toBe(args.shortTitle.uk);
    expect(article.shortTitle.ru).toBe(args.shortTitle.ru);
    expect(article.shortTitle.en).toBe(args.shortTitle.en);
    expect(article.content.uk).toBe(args.content.uk);
    expect(article.content.ru).toBe(args.content.ru);
    expect(article.content.en).toBe(args.content.en);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    // в существующий документ добавляется ссылка на созданную публикацию
    const { items } = excerpt;
    expect(items.length).toBe(4);
    expect(items[items.length - 1].toString()).toBe(article._id.toString());
  });

  test('should add article with known _id in db', async () => {
    const name = 'addArticle';
    const args = {
      _id: ObjectID().toString(),
      subject: ['copyright'],
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
      content,
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

    const { title, _id } = response.body.data.addArticle;
    expect(title).toEqual(args.title);
    expect(_id).toEqual(args._id);

    const article = await Article.findById(_id);
    expect(coerceArray(article.subject)).toEqual(args.subject);
    expect(article.section).toBe(args.section);
    expect(article.slug).toBe(args.slug);
    expect(article.title.uk).toBe(args.title.uk);
    expect(article.title.ru).toBe(args.title.ru);
    expect(article.title.en).toBe(args.title.en);
    expect(article.shortTitle.uk).toBe(args.shortTitle.uk);
    expect(article.shortTitle.ru).toBe(args.shortTitle.ru);
    expect(article.shortTitle.en).toBe(args.shortTitle.en);
    expect(article.content.uk).toBe(args.content.uk);
    expect(article.content.ru).toBe(args.content.ru);
    expect(article.content.en).toBe(args.content.en);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    // // создается документ с указанием на ранее созданную публикацию
    expect(excerpt.items[0].toString()).toBe(article._id.toString());
  });

  test('should not add article with already existing _id db', async () => {
    const name = 'addArticle';
    const articles = await Article.find();
    const args = {
      _id: articles[0]._id.toString(),
      subject: ['trademark'],
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
      content,
    };
    const fields = {
      _id: null,
      title: {
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
    expect(response.body.data.addArticle).toBeNull();

    const article = await Article.findById(articles[0]._id);
    expect(coerceArray(article.subject)).toEqual(
      coerceArray(articles[0].subject),
    );
    expect(article.section).toBe(articles[0].section);
    expect(article.slug).toBe(articles[0].slug);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    expect(excerpt).toBeNull();
  });

  test('should not add article with already existing subject & section & slug in db', async () => {
    const name = 'addArticle';
    const articles = await Article.find();
    const articlesCount = articles.length;
    const args = {
      subject: articles[0].subject,
      section: articles[0].section,
      slug: articles[0].slug,
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
    const fields = {
      _id: null,
      title: {
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

    expect(response.body.data.addArticle).toBeNull();
    // ничего не добавлено в articles
    const count = await Article.count({});
    expect(count).toBe(articlesCount);
    // ничего не добавлено в excerpts
    const excerpt = await Excerpt.findOne({
      subject: articles[0].subject[0],
      section: articles[0].section,
    });
    expect(excerpt.items.length).toBe(3);
  });

  test('should return null for unathorized request', async () => {
    const articlesCount = await Article.count({});
    const name = 'addArticle';
    const args = {
      subject: ['trademark'],
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
      content,
    };
    const fields = {
      _id: null,
      title: {
        uk: null,
        ru: null,
        en: null,
      },
    };
    const queryBody = objectsToQueryBody(name, args, fields, true);
    const response = await request
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    expect(response.body.data.addArticle).toBeNull();
    const count = await Article.count({});
    expect(count).toBe(articlesCount);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    expect(excerpt).toBeNull();
  });
});
