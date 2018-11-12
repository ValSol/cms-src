/* eslint-env jest */
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
import articlesForImport from './articlesForImport.json';

let Article;
let Excerpt;
let UkTextIndex;
let RuTextIndex;
let EnTextIndex;

const request = supertest('http://localhost:3000');

describe('Import Articles mutation', () => {
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

  test('should import articles and excerpts into db', async () => {
    // получаем количество articles до импорта
    const articlesCount = await Article.count();
    // получаем количество выборок до импорта
    const excerptsCount = await Excerpt.count();
    // получаем количество текстовых индексов в локали 'uk' до импорта
    const ukTextIndexCount = await UkTextIndex.count();
    // получаем количество текстовых индексов в локали 'ru' до импорта
    const ruTextIndexCount = await RuTextIndex.count();
    // получаем количество текстовых индексов в локали 'en' до импорта
    const enTextIndexCount = await EnTextIndex.count();

    const name = 'importArticles';
    const args = {
      things: articlesForImport.articles,
      excerpts: articlesForImport.article_excerpts,
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

    const { importArticles } = response.body.data;
    // количество полученных импортированных публикаций ...
    // ... равно количеству загружаемых
    expect(importArticles.length).toBe(articlesForImport.articles.length);
    // получаем количество articles после импорта
    const articlesCount2 = await Article.count();
    // получаем количество выборок после импорта
    const excerptsCount2 = await Excerpt.count();
    // получаем количество текстовых индексов после импорта
    const ukTextIndexCount2 = await UkTextIndex.count();
    const ruTextIndexCount2 = await RuTextIndex.count();
    const enTextIndexCount2 = await EnTextIndex.count();
    // и убеждаемся что к базе данных добавились
    // ... правильное число публикаций
    expect(articlesCount2).toBe(
      articlesCount + articlesForImport.articles.length,
    );
    // ... правильное число выборок
    expect(excerptsCount2).toBe(
      // excerptsCount + articlesForImport.article_excerpts.length,
      excerptsCount + 1,
    );
    // ... правильное число текстовых индексов
    expect(ukTextIndexCount2).toBe(
      ukTextIndexCount + articlesForImport.articles.length,
    );
    expect(ruTextIndexCount2).toBe(
      ruTextIndexCount + articlesForImport.articles.length,
    );
    expect(enTextIndexCount2).toBe(
      enTextIndexCount + articlesForImport.articles.length,
    );

    // проверяем что были добавлены backLinks
    const article0 = await Article.findById('5a720e599578e32044e8a66d');
    expect(article0.backLinks.length).toBe(1);
    expect(article0.backLinks[0].itemThingName).toBe('Article');
    expect(article0.backLinks[0].item.toString()).toBe(
      '5a720e599578e32044e8a671',
    );
    const article1 = await Article.findById('5a720e599578e32044e8a66e');
    expect(article1.backLinks.length).toBe(1);
    expect(article1.backLinks[0].itemThingName).toBe('Article');
    expect(article1.backLinks[0].item.toString()).toBe(
      '5a720e599578e32044e8a671',
    );
  });

  test('should import articles into db', async () => {
    // получаем количество articles до импорта
    const articlesCount = await Article.count();
    // получаем количество выборок до импорта
    const excerptsCount = await Excerpt.count();
    // получаем количество текстовых индексов в локали 'uk' до импорта
    const ukTextIndexCount = await UkTextIndex.count();
    // получаем количество текстовых индексов в локали 'ru' до импорта
    const ruTextIndexCount = await RuTextIndex.count();
    // получаем количество текстовых индексов в локали 'en' до импорта
    const enTextIndexCount = await EnTextIndex.count();

    const name = 'importArticles';
    const args = {
      things: articlesForImport.articles,
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

    const { importArticles } = response.body.data;
    // количество полученных импортированных публикаций ...
    // ... равно количеству загружаемых
    expect(importArticles.length).toBe(articlesForImport.articles.length);
    // получаем количество articles после импорта
    const articlesCount2 = await Article.count();
    // получаем количество выборок после импорта
    const excerptsCount2 = await Excerpt.count();
    // получаем количество текстовых индексов после импорта
    const ukTextIndexCount2 = await UkTextIndex.count();
    const ruTextIndexCount2 = await RuTextIndex.count();
    const enTextIndexCount2 = await EnTextIndex.count();
    // и убеждаемся что к базе данных добавились
    // ... правильное число публикаций
    expect(articlesCount2).toBe(
      articlesCount + articlesForImport.articles.length,
    );
    // ... правильное число выборок
    expect(excerptsCount2).toBe(
      // excerptsCount + articlesForImport.article_excerpts.length,
      excerptsCount + 1,
    );
    // ... правильное число текстовых индексов
    expect(ukTextIndexCount2).toBe(
      ukTextIndexCount + articlesForImport.articles.length,
    );
    expect(ruTextIndexCount2).toBe(
      ruTextIndexCount + articlesForImport.articles.length,
    );
    expect(enTextIndexCount2).toBe(
      enTextIndexCount + articlesForImport.articles.length,
    );
  });

  test('should import articles into db and fix errors', async () => {
    // получаем количество articles до импорта
    const articlesCount = await Article.count();
    // получаем количество выборок до импорта
    const excerptsCount = await Excerpt.count();
    // получаем количество текстовых индексов в локали 'uk' до импорта
    const ukTextIndexCount = await UkTextIndex.count();
    // получаем количество текстовых индексов в локали 'ru' до импорта
    const ruTextIndexCount = await RuTextIndex.count();
    // получаем количество текстовых индексов в локали 'en' до импорта
    const enTextIndexCount = await EnTextIndex.count();

    // вносим искуственные ошибки в БД
    await Excerpt.remove();
    await UkTextIndex.remove();

    const name = 'importArticles';
    const args = {
      things: articlesForImport.articles,
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

    const { importArticles } = response.body.data;
    // количество полученных импортированных публикаций ...
    // ... равно количеству загружаемых
    expect(importArticles.length).toBe(articlesForImport.articles.length);
    // получаем количество articles после импорта
    const articlesCount2 = await Article.count();
    // получаем количество выборок после импорта
    const excerptsCount2 = await Excerpt.count();
    // получаем количество текстовых индексов после импорта
    const ukTextIndexCount2 = await UkTextIndex.count();
    const ruTextIndexCount2 = await RuTextIndex.count();
    const enTextIndexCount2 = await EnTextIndex.count();
    // и убеждаемся что к базе данных добавились
    // ... правильное число публикаций
    expect(articlesCount2).toBe(
      articlesCount + articlesForImport.articles.length,
    );
    // ... правильное число выборок
    expect(excerptsCount2).toBe(
      // excerptsCount + articlesForImport.article_excerpts.length,
      excerptsCount + 1,
    );
    // ... правильное число текстовых индексов
    expect(ukTextIndexCount2).toBe(
      ukTextIndexCount + articlesForImport.articles.length,
    );
    expect(ruTextIndexCount2).toBe(
      ruTextIndexCount + articlesForImport.articles.length,
    );
    expect(enTextIndexCount2).toBe(
      enTextIndexCount + articlesForImport.articles.length,
    );
  });

  test('should fix errors', async () => {
    // вносим искуственные ошибки в БД
    const excerptCount = await Excerpt.count();
    const textIndexCount = await UkTextIndex.count();

    await Excerpt.remove();
    await UkTextIndex.remove();
    const name = 'importArticles';
    const args = {};
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

    const { importArticles } = response.body.data;
    // количество полученных импортированных публикаций ...
    // ... равно количеству загружаемых (ничего не загружали ничего не получили)
    expect(importArticles.length).toBe(0);
    // по ходу дела исправили коллекции excerpts и ukTextIndexes
    const excerptCount2 = await Excerpt.count();
    const textIndexCount2 = await UkTextIndex.count();
    expect(excerptCount).toBe(excerptCount2);
    expect(textIndexCount).toBe(textIndexCount2);
  });

  test('should return null for unathorized request', async () => {
    // получаем количество articles до импорта
    const articlesCount = await Article.count();
    // получаем количество выборок до импорта
    const excerptsCount = await Excerpt.count();
    // получаем количество текстовых индексов до импорта
    const ukTextIndexCount = await UkTextIndex.count();
    const ruTextIndexCount = await RuTextIndex.count();
    const enTextIndexCount = await EnTextIndex.count();

    const name = 'importArticles';
    const args = {
      things: articlesForImport.articles,
      excerpts: articlesForImport.article_excerpts,
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

    expect(response.body.data.importArticles).toBeNull();

    // получаем количество articles после попытки импорта
    const articlesCount2 = await Article.count();
    // получаем количество выборок после попытки импорта
    const excerptsCount2 = await Excerpt.count();
    // получаем количество текстовых индексов после попытки импорта
    const ukTextIndexCount2 = await UkTextIndex.count();
    const ruTextIndexCount2 = await RuTextIndex.count();
    const enTextIndexCount2 = await EnTextIndex.count();

    // убеждаемся что число публикаций, выборок и текстовых индексов ...
    // ... не изменилось
    expect(articlesCount2).toBe(articlesCount);
    expect(excerptsCount2).toBe(excerptsCount);
    expect(ukTextIndexCount2).toBe(ukTextIndexCount);
    expect(ruTextIndexCount2).toBe(ruTextIndexCount);
    expect(enTextIndexCount2).toBe(enTextIndexCount);
  });
});
