/* eslint-env jest */
/* eslint no-underscore-dangle: 0 */
import Promise from 'bluebird';
import supertest from 'supertest';

import jwt from 'jsonwebtoken';

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

describe('Update Article mutation', () => {
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
  afterAll(populateArticles);
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

  test('should update article in db', async () => {
    const name = 'updateArticle';
    const articles = await Article.find();
    const id = articles[0]._id.toString();
    const prevExcerpt = await Excerpt.findOne({ items: id });
    const prevExcerptId = prevExcerpt._id;
    const prevItemsLength = prevExcerpt.items.length;

    const id1 = articles[1]._id.toString();
    const id2 = articles[2]._id.toString();
    const id3 = articles[3]._id.toString();
    const id4 = articles[4]._id.toString();
    const id5 = articles[5]._id.toString();
    const upsert0 = {
      $addToSet: { backLinks: { item: id, itemThingName: 'Article' } },
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
              _id: id4,
              thingName: 'Article',
            },
          },
          1: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info/abc',
              _id: id5,
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

    const content3 = {
      ...content,
      uk: JSON.stringify({
        entityMap: {
          0: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info',
              _id: id1,
              thingName: 'Article',
            },
          },
          1: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
              href: '/patent/info/abc',
              _id: id2,
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
      _id: id.toString(),
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
      content: content2,
      initial: {
        content: content3,
      },
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
    const { updateArticle } = response.body.data;
    expect(updateArticle.title).toEqual(args.title);
    expect(updateArticle.shortTitle).toEqual(args.shortTitle);
    expect(updateArticle.content).toEqual(args.content);

    const article = await Article.findById(id);
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

    const excerpt = await Excerpt.findOne({ items: id });
    // создан новый excerpt со ссылкой на обновляемую article
    expect(excerpt.items.length).toEqual(1);
    expect(excerpt.items[0].toString()).toEqual(id);
    // старый excerpt обновлен с удалением одной ссылки на article
    const prevExcerpt2 = await Excerpt.findById(prevExcerptId);
    expect(prevExcerpt2.items.length).toEqual(prevItemsLength - 1);

    const ukTextIndex = await UkTextIndex.findOne({ _item: id });
    expect(ukTextIndex.title).toBe(args.title.uk);
    expect(ukTextIndex.content).toBe(contentIndex.uk);

    const ruTextIndex = await RuTextIndex.findOne({ _item: id });
    expect(ruTextIndex.title).toBe(args.title.ru);
    expect(ruTextIndex.content).toBe(contentIndex.ru);

    const enTextIndex = await EnTextIndex.findOne({ _item: id });
    expect(enTextIndex.title).toBe(args.title.en);
    expect(enTextIndex.content).toBe(contentIndex.en);

    // проверяем backLinks в документах на которые были ссылки
    const article1 = await Article.findById(id1);
    expect(article1.backLinks.length).toBe(1);
    expect(article1.backLinks[0].itemThingName).toBe('Article');
    expect(article1.backLinks[0].item.toString()).toBe(id3);
    const article2 = await Article.findById(id2);
    expect(article2.backLinks.length).toBe(1);
    expect(article2.backLinks[0].itemThingName).toBe('Article');
    expect(article2.backLinks[0].item.toString()).toBe(id3);
    const article4 = await Article.findById(id4);
    expect(article4.backLinks.length).toBe(1);
    expect(article4.backLinks[0].itemThingName).toBe('Article');
    expect(article4.backLinks[0].item.toString()).toBe(id);
    const article5 = await Article.findById(id5);
    expect(article5.backLinks.length).toBe(1);
    expect(article5.backLinks[0].itemThingName).toBe('Article');
    expect(article5.backLinks[0].item.toString()).toBe(id);
  });
  test('should update article only some keys in db', async () => {
    const name = 'updateArticle';
    const articles = await Article.find({
      subject: 'patent',
      section: 'info',
    });
    const id = articles[0]._id.toString();
    const prevExcerpt = await Excerpt.findOne({ items: id });
    const prevExcerptId = prevExcerpt._id;
    const prevItemsLength = prevExcerpt.items.length;
    const prevExcerpt2 = await Excerpt.findOne({
      subject: 'design',
      section: 'info',
    });
    const prevItemsLength2 = prevExcerpt2.items.length;
    const ruTextIndexPrev = await RuTextIndex.findOne({ _item: id });
    const enTextIndexPrev = await EnTextIndex.findOne({ _item: id });
    const args = {
      _id: id,
      subject: ['design'],
      section: 'info',
      slug: 'abcplus',
      title: {
        uk: 'українською',
      },
      shortTitle: {
        uk: 'по рус',
      },
      content: {
        uk: content.uk,
      },
      initial: {
        content: {
          uk: content.uk,
        },
      },
    };
    const fields = {
      _id: null,
      subject: null,
      section: null,
      slug: null,
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

    const { updateArticle } = response.body.data;
    // поменялись только те данные который указаны в args
    expect(updateArticle.subject).toEqual(args.subject);
    expect(updateArticle.section).toBe(args.section);
    expect(updateArticle.slug).toBe(args.slug);
    expect(updateArticle.title.uk).toBe(args.title.uk);
    expect(updateArticle.title.ru).toBe(articles[0].title.ru);
    expect(updateArticle.title.en).toBe(articles[0].title.en);
    expect(updateArticle.shortTitle.uk).toBe(args.shortTitle.uk);
    expect(updateArticle.shortTitle.ru).toBe(articles[0].shortTitle.ru);
    expect(updateArticle.shortTitle.en).toBe(articles[0].shortTitle.en);
    expect(updateArticle.content.uk).toBe(content.uk);
    expect(updateArticle.content.ru).toBe(articles[0].content.ru);
    expect(updateArticle.content.en).toBe(articles[0].content.en);

    // убеждаемся что поменялись только те данные который указаны в args
    // обратившись к БД
    const article = await Article.findById(id);
    expect(coerceArray(article.subject)).toEqual(args.subject);
    expect(article.section).toBe(args.section);
    expect(article.slug).toBe(args.slug);
    expect(article.title.uk).toBe(args.title.uk);
    expect(article.title.ru).toBe(articles[0].title.ru);
    expect(article.title.en).toBe(articles[0].title.en);
    expect(article.shortTitle.uk).toBe(args.shortTitle.uk);
    expect(article.shortTitle.ru).toBe(articles[0].shortTitle.ru);
    expect(article.shortTitle.en).toBe(articles[0].shortTitle.en);
    expect(article.content.uk).toBe(content.uk);
    expect(article.content.ru).toBe(articles[0].content.ru);
    expect(article.content.en).toBe(articles[0].content.en);
    // обновлен excerpt со ссылкой на обновляемую article
    const excerpt = await Excerpt.findOne({ items: id });
    expect(excerpt.items.length).toEqual(prevItemsLength2 + 1);
    // обновлен excerpt со ссылкой на обновляемую article
    const excerpt2 = await Excerpt.findById(prevExcerptId);
    expect(excerpt2.items.length).toEqual(prevItemsLength - 1);
    // проверяем изменение текстовых индексов
    const ukTextIndex = await UkTextIndex.findOne({ _item: id });
    expect(ukTextIndex.title).toBe(args.title.uk);
    expect(ukTextIndex.content).toBe(contentIndex.uk);

    const ruTextIndex = await RuTextIndex.findOne({ _item: id });
    expect(ruTextIndex.title).toBe(ruTextIndexPrev.title);
    expect(ruTextIndex.content).toBe(ruTextIndexPrev.content);

    const enTextIndex = await EnTextIndex.findOne({ _item: id });
    expect(enTextIndex.title).toBe(enTextIndexPrev.title);
    expect(enTextIndex.content).toBe(enTextIndexPrev.content);
  });

  test('should update article only paramFields in db ', async () => {
    const name = 'updateArticle';
    const prevExcerpt = await Excerpt.findOne({
      subject: 'patent',
      section: 'services',
    });
    const prevExcerptId = prevExcerpt.toObject()._id;
    const prevItemsLength = prevExcerpt.toObject().items.length;
    expect(prevItemsLength).toBe(1);
    const aritcleId = prevExcerpt.toObject().items[0].toString();

    const prevExcerpt2 = await Excerpt.findOne({
      subject: 'patent',
      section: 'info',
    });
    const prevExcerptId2 = prevExcerpt2.toObject()._id;
    const prevItemsLength2 = prevExcerpt2.toObject().items.length;
    expect(prevItemsLength2).toBe(3);

    const args = {
      _id: aritcleId,
      subject: ['patent'],
      section: 'info',
      slug: 'abcplus',
    };
    const fields = {
      _id: null,
      subject: null,
      section: null,
      slug: null,
    };

    const queryBody = objectsToQueryBody(name, args, fields, true);
    const response = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody)
      .expect(200);

    const { updateArticle } = response.body.data;
    // поменялись данные который указаны в args
    expect(updateArticle.slug).toBe(args.slug);
    expect(updateArticle.subject).toEqual(args.subject);
    expect(updateArticle.section).toEqual(args.section);

    // убеждаемся что поменялись данные в articles обратившись к БД
    const article = await Article.findById(aritcleId);
    expect(coerceArray(article.subject)).toEqual(args.subject);
    expect(article.section).toBe(args.section);
    expect(article.slug).toBe(args.slug);
    // убеждаемся что поменялись данные в excerpts обратившись к БД
    const excerpt = await Excerpt.findById(prevExcerptId);
    expect(excerpt).toBe(null);
    const excerpt2 = await Excerpt.findById(prevExcerptId2);
    expect(excerpt2.toObject().items.length).toBe(prevItemsLength2 + 1);

    const excerptsOfServicesSection = await Excerpt.find({
      section: 'services',
    });
    expect(excerptsOfServicesSection.length).toBe(0);
    // -------------------------------------------------------------------------
    const excerptsCount = await Excerpt.count();
    // изменяем paramFields в аргументах
    args.subject = ['trademark', 'copyright', 'patent', 'design'];
    args.section = 'services';
    const queryBody2 = objectsToQueryBody(name, args, fields, true);
    const response2 = await request
      .post('/graphql')
      .set('Cookie', `id_token=${token}`)
      .set('Accept', 'application/json')
      .set('content-type', 'application/json')
      .send(queryBody2)
      .expect(200);

    const { updateArticle: updateArticle2 } = response2.body.data;
    // поменялись данные который указаны в args
    expect(updateArticle2.slug).toBe(args.slug);
    expect(updateArticle2.subject).toEqual(args.subject);
    expect(updateArticle2.section).toEqual(args.section);

    // убеждаемся что поменялись данные в articles обратившись к БД
    const article2 = await Article.findById(aritcleId);
    expect(coerceArray(article2.subject)).toEqual(args.subject);
    expect(article2.section).toBe(args.section);
    expect(article2.slug).toBe(args.slug);
    // убеждаемся что поменялись данные в excerpts обратившись к БД
    const excerpt3 = await Excerpt.findById(prevExcerptId2);
    expect(excerpt3.toObject().items.length).toBe(prevItemsLength2);
    const excerptsCount2 = await Excerpt.count();
    expect(excerptsCount2).toBe(excerptsCount + 4);
    // только что созданные выборки
    const excerpt4 = await Excerpt.findOne({
      subject: 'trademark',
      section: 'services',
    });
    expect(excerpt4.toObject().items.length).toBe(1);
    expect(excerpt4.toObject().items[0].toString()).toBe(aritcleId);

    const excerpt5 = await Excerpt.findOne({
      subject: 'copyright',
      section: 'services',
    });
    expect(excerpt5.toObject().items.length).toBe(1);
    expect(excerpt5.toObject().items[0].toString()).toBe(aritcleId);

    const excerpt6 = await Excerpt.findOne({
      subject: 'patent',
      section: 'services',
    });
    expect(excerpt6.toObject().items.length).toBe(1);
    expect(excerpt6.toObject().items[0].toString()).toBe(aritcleId);

    const excerpt7 = await Excerpt.findOne({
      subject: 'design',
      section: 'services',
    });
    expect(excerpt7.toObject().items.length).toBe(1);
    expect(excerpt7.toObject().items[0].toString()).toBe(aritcleId);
  });

  test('should not update article with not unique subject and section and slug', async () => {
    const name = 'updateArticle';
    const articles = await Article.find({
      subject: 'patent',
      section: 'info',
    });
    const args = {
      _id: articles[0]._id.toString(),
      subject: articles[1].subject,
      section: articles[1].section,
      slug: articles[1].slug,
      title: {
        uk: 'українською',
      },
      shortTitle: {
        en: 'updated short title',
      },
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

    expect(response.body.data.updateArticle).toBeNull();

    const article = await Article.findById(articles[0]._id);
    expect(article.slug).toBe(articles[0].slug);
    expect(article.title.uk).toBe(articles[0].title.uk);
    expect(article.title.ru).toBe(articles[0].title.ru);
    expect(article.title.en).toBe(articles[0].title.en);
    expect(article.shortTitle.uk).toBe(articles[0].shortTitle.uk);
    expect(article.shortTitle.ru).toBe(articles[0].shortTitle.ru);
    expect(article.shortTitle.en).toBe(articles[0].shortTitle.en);
    expect(article.content.uk).toBe(articles[0].content.uk);
    expect(article.content.ru).toBe(articles[0].content.ru);
    expect(article.content.en).toBe(articles[0].content.en);
  });

  test('should return null for unathorized request', async () => {
    const name = 'updateArticle';
    const articles = await Article.find({
      subject: 'patent',
      section: 'info',
    });
    const args = {
      _id: articles[0]._id.toString(),
      subject: ['copyright'],
      section: 'services',
      slug: 'abcplus',
      title: {
        uk: 'українською',
        ru: 'по русски',
        en: 'in inglish',
      },
      shortTitle: {
        uk: 'по рус',
      },
      content: {
        uk: 'content in inglish',
      },
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

    expect(response.body.data.updateArticle).toBeNull();

    const article = await Article.findById(articles[0]._id);
    expect(coerceArray(article.subject)).toEqual(
      coerceArray(articles[0].subject),
    );
    expect(article.section).toBe(articles[0].section);
    expect(article.slug).toBe(articles[0].slug);
    expect(article.title.uk).toBe(articles[0].title.uk);
    expect(article.title.ru).toBe(articles[0].title.ru);
    expect(article.title.en).toBe(articles[0].title.en);
    expect(article.shortTitle.uk).toBe(articles[0].shortTitle.uk);
    expect(article.shortTitle.ru).toBe(articles[0].shortTitle.ru);
    expect(article.shortTitle.en).toBe(articles[0].shortTitle.en);
    expect(article.content.uk).toBe(articles[0].content.uk);
    expect(article.content.ru).toBe(articles[0].content.ru);
    expect(article.content.en).toBe(articles[0].content.en);

    const excerpt = await Excerpt.findOne({
      subject: args.subject[0],
      section: args.section,
    });
    expect(excerpt).toBeNull();
  });
});
