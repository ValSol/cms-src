/* eslint no-underscore-dangle: 0 */
import Promise from 'bluebird';
import { ObjectID } from 'mongodb';
import { ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import jsdom from 'jsdom';

import {
  getThingModel,
  getExcerptModel,
  getTextIndex,
} from '../../../../data/mongooseModels';

const { JSDOM } = jsdom;

const articles = [
  {
    _id: new ObjectID(),
    subject: ['patent'],
    section: 'info',
    pictures: [],
    slug: 'abc',
    title: {
      uk: 'abc - дуже довга назва',
      ru: 'abc - очень длинный заголовок',
      en: 'abc - very long title',
    },
    shortTitle: {
      uk: 'abc - коротко',
      ru: 'abc - кратко',
      en: 'abc - short',
    },
    content: {
      uk: `abc контент українською
  <ul>
  <li>перший пунк abc</li>
  <li>другий пункт abc</li>
  <li>третій пункт abc</li>
  </ul>
  тестування дуже нечіткого пошуку
  `,
      ru: `abc контент по русски
  <ul>
  <li>первый пунк abc</li>
  <li>второй пункт abc</li>
  <li>третий пункт abc</li>
  </ul>
  `,
      en: `abc content in english
  <ul>
  <li>first point abc</li>
  <li>second point abc</li>
  <li>third point abc</li>
  </ul>
  `,
    },
  },
  {
    _id: new ObjectID(),
    subject: ['patent'],
    section: 'info',
    pictures: [],
    slug: 'xyz',
    title: {
      uk: 'xyz - дуже довга назва (тестування пошуку)',
      ru: 'xyz - очень длинный заголовок',
      en: 'xyz - very long title',
    },
    shortTitle: {
      uk: 'xyz - коротко',
      ru: 'xyz - кратко',
      en: 'xyz - short',
    },
    content: {
      uk: `xyz контент українською
  <ul>
  <li>перший пунк xyz</li>
  <li>другий пункт xyz</li>
  <li>третій пункт xyz</li>
  </ul>
  `,
      ru: `xyz контент по русски
  <ul>
  <li>первый пунк xyz</li>
  <li>второй пункт xyz</li>
  <li>третий пункт xyz</li>
  </ul>
  `,
      en: `xyz content in english
  <ul>
  <li>first point xyz</li>
  <li>second point xyz</li>
  <li>third point xyz</li>
  </ul>
  `,
    },
  },
  {
    _id: new ObjectID(),
    subject: ['design'],
    section: 'info',
    pictures: [],
    slug: '',
    title: {
      uk: 'індексова сторінка - дуже довга назва (design)',
      ru: 'индексная страница - очень длинный заголовок (design)',
      en: 'index page - very long title (design)',
    },
    shortTitle: {
      uk: 'індексова сторінка (design)',
      ru: 'индексная страница (design)',
      en: 'index page (design)',
    },
    content: {
      uk: `індекс контент українською (design)
  <ul>
  <li>перший пунк індекс</li>
  <li>другий пункт індекс</li>
  <li>третій пункт індекс</li>
  </ul>
  `,
      ru: `индекс контент по русски (design)
  <ul>
  <li>первый пунк индекс</li>
  <li>второй пункт индекс</li>
  <li>третий пункт индекс</li>
  </ul>
  `,
      en: `xyz content in english (design)
  <ul>
  <li>first point index</li>
  <li>second point index</li>
  <li>third point index</li>
  </ul>
  `,
    },
  },
  {
    _id: new ObjectID(),
    subject: ['patent'],
    section: 'info',
    pictures: [],
    slug: '',
    title: {
      uk: 'індексова сторінка - дуже довга назва',
      ru: 'индексная страница - очень длинный заголовок',
      en: 'index page! - very long title',
    },
    shortTitle: {
      uk: 'індексова сторінка',
      ru: 'индексная страница',
      en: 'index page',
    },
    content: {
      uk: `індекс контент українською (design)
  <ul>
  <li>перший пунк індекс</li>
  <li>другий пункт індекс</li>
  <li>третій пункт індекс</li>
  </ul>
  тестування пошуку
  `,
      ru: `индекс контент по русски (design)
  <ul>
  <li>первый пунк индекс</li>
  <li>второй пункт индекс</li>
  <li>третий пункт индекс</li>
  </ul>
  `,
      en: `xyz content in english (design)
  <ul>
  <li>first point index</li>
  <li>second point index</li>
  <li>third point index</li>
  </ul>
  `,
    },
  },
  {
    _id: new ObjectID(),
    subject: ['patent'],
    section: 'services',
    pictures: [],
    slug: '',
    title: {
      uk: 'індексова сторінка - services - дуже довга назва',
      ru: 'индексная страница - services- очень длинный заголовок',
      en: 'index page! - services - very long title',
    },
    shortTitle: {
      uk: 'індексова сторінка - services',
      ru: 'индексная страница - services',
      en: 'index page - services',
    },
    content: {
      uk: `індекс контент українською (services)
  <ul>
  <li>перший пунк індекс</li>
  <li>другий пункт індекс</li>
  <li>третій пункт індекс</li>
  </ul>
  `,
      ru: `индекс контент по русски (services)
  <ul>
  <li>первый пунк индекс</li>
  <li>второй пункт индекс</li>
  <li>третий пункт индекс</li>
  </ul>
  `,
      en: `xyz content in english (services)
  <ul>
  <li>first point index</li>
  <li>second point index</li>
  <li>third point index</li>
  </ul>
  `,
    },
  },
  {
    _id: new ObjectID(),
    subject: ['trademark', 'copyright'],
    section: 'info',
    pictures: [],
    slug: 'xxx',
    title: {
      uk: 'trademark - copyright - дуже довга назва',
      ru: 'trademark - copyright - очень длинный заголовок',
      en: 'trademark - copyright - very long title',
    },
    shortTitle: {
      uk: 'індексова сторінка - trademark - copyright',
      ru: 'индексная страница - trademark - copyright',
      en: 'index page - trademark - copyright',
    },
    content: {
      uk: `індекс контент українською (trademark - copyright)
  <ul>
  <li>перший пунк</li>
  <li>другий пункт</li>
  <li>третій пункт</li>
  </ul>
  `,
      ru: `индекс контент по русски (trademark - copyright)
  <ul>
  <li>первый пунк</li>
  <li>второй пункт</li>
  <li>третий пункт</li>
  </ul>
  `,
      en: `xyz content in english (trademark - copyright)
  <ul>
  <li>first point</li>
  <li>second point</li>
  <li>third point</li>
  </ul>
  `,
    },
  },
];

// ------------------------------

const simpleDOMBuilder = html => {
  const { document, HTMLElement, HTMLAnchorElement } = new JSDOM(
    '<!DOCTYPE html>',
  ).window;

  global.HTMLElement = HTMLElement;
  global.HTMLAnchorElement = HTMLAnchorElement;

  const doc = document.implementation.createHTMLDocument('foo');
  doc.documentElement.innerHTML = html;
  const root = doc.getElementsByTagName('body')[0];
  return root;
};

const rawContent = {};

rawContent.uk = articles.map(article => {
  const blocksFromHTML = convertFromHTML(article.content.uk, simpleDOMBuilder);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );
  return convertToRaw(state);
});

rawContent.ru = articles.map(article => {
  const blocksFromHTML = convertFromHTML(article.content.ru, simpleDOMBuilder);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );
  return convertToRaw(state);
});

rawContent.en = articles.map(article => {
  const blocksFromHTML = convertFromHTML(article.content.en, simpleDOMBuilder);
  const state = ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap,
  );
  return convertToRaw(state);
});

const textContent = {};

textContent.uk = rawContent.uk.map(({ blocks }) => {
  const texts = blocks.map(({ text }) => text);
  return texts.join('\n');
});

textContent.ru = rawContent.ru.map(({ blocks }) => {
  const texts = blocks.map(({ text }) => text);
  return texts.join('\n');
});

textContent.en = rawContent.en.map(({ blocks }) => {
  const texts = blocks.map(({ text }) => text);
  return texts.join('\n');
});

const articlesUk = articles.map((article, i) => ({
  title: article.title.uk,
  content: textContent.uk[i],
  _item: article._id,
}));

const articlesRu = articles.map((article, i) => ({
  title: article.title.ru,
  content: textContent.ru[i],
  _item: article._id,
}));

const articlesEn = articles.map((article, i) => ({
  title: article.title.en,
  content: textContent.en[i],
  _item: article._id,
}));

const articles2 = articles.map((article, i) => ({
  ...article,
  content: {
    uk: JSON.stringify(rawContent.uk[i]),
    ru: JSON.stringify(rawContent.ru[i]),
    en: JSON.stringify(rawContent.en[i]),
  },
}));

const paramNames = JSON.stringify(['section', 'subject']);
const excerpts = [
  {
    paramNames,
    subject: 'patent',
    section: 'info',
    items: [articles[3]._id, articles[0]._id, articles[1]._id],
  },
  {
    paramNames,
    subject: 'patent',
    section: 'services',
    items: [articles[4]._id],
  },
  {
    paramNames,
    subject: 'design',
    section: 'info',
    items: [articles[2]._id],
  },
  {
    paramNames,
    subject: 'trademark',
    section: 'info',
    items: [articles[5]._id],
  },
  {
    paramNames,
    subject: 'copyright',
    section: 'info',
    items: [articles[5]._id],
  },
];

const populateArticles = () => {
  const promises = [];
  promises.push(
    getThingModel('Article').then(Article =>
      Article.remove({}).then(() => Article.insertMany(articles2)),
    ),
  );

  promises.push(
    getExcerptModel('Article').then(Excerpt =>
      Excerpt.remove({}).then(() => Excerpt.insertMany(excerpts)),
    ),
  );

  promises.push(
    getTextIndex('Article', 'uk').then(TextIndex =>
      TextIndex.remove({}).then(() => TextIndex.insertMany(articlesUk)),
    ),
  );

  promises.push(
    getTextIndex('Article', 'ru').then(TextIndex =>
      TextIndex.remove({}).then(() => TextIndex.insertMany(articlesRu)),
    ),
  );

  promises.push(
    getTextIndex('Article', 'en').then(TextIndex =>
      TextIndex.remove({}).then(() => TextIndex.insertMany(articlesEn)),
    ),
  );
  return Promise.all(promises);
};

export default populateArticles;
