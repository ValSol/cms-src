import flat, { unflatten } from 'flat';

import { locales } from '../../../appConfig';
/*  функция возрващает объект в котором
1) удаляет __typename ключи из всех
2) richText поля из JSON строки преобразуются в draft.js объект, при этом ...
... осуществляется рекурсивный обход ДЕРЕВА полей во внедренных ...
... документах (subDocumentFields)

например:
  title: {
    uk: 'Назва',
    ru: 'Заголовок',
    en: 'Title',
  },
  content: {
    uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
    ru: '{"entityMap":{},"blocks":[{"text":"Контент по русски"}]}',
    en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
  },
  comment: {
    title: {
      uk: 'Назва',
      ru: 'Заголовок',
      en: 'Title',
    },
    content: {
      uk: '{"entityMap":{},"blocks":[{"text":"Контент українською"}]}',
      ru: '{"entityMap":{},"blocks":[{"text":"Контент по русски"}]}',
      en: '{"entityMap":{},"blocks":[{"text":"Content in English"}]}',
    },
  }
  преобразуется в
    title: {
      uk: 'Назва',
      ru: 'Заголовок',
      en: 'Title',
    },
    content: {
      uk: {entityMap: {}, blocks: [{text: 'Контент українською'}]},
      ru: {entityMap: {}, blocks: [{text: 'Контент по русски'}]},
      en: {entityMap: {}, blocks: [{text: 'Content in English'}]},
    },
    comment: {
      title: {
        uk: 'Назва коментарію',
        ru: 'Заголовок комментария',
        en: 'Title of comment',
      },
      content: {
        uk: {entityMap: {}, blocks: [{text: 'Контент українською'}]},
        ru: {entityMap: {}, blocks: [{text: 'Контент по русски'}]},
        en: {entityMap: {}, blocks: [{text: 'Content in English'}]},
      },
    }
*/
// obj - объект содержащий i18n поля
const unpackFields0 = (
  fields,
  thingConfigOrSubDocumentAttributes,
  result = {},
) => {
  const {
    richTextFields,
    subDocumentFields,
  } = thingConfigOrSubDocumentAttributes;
  // отдельно преобразуем RichText поля из строк в draft.js объекты
  const subDocumentFieldsObject = subDocumentFields.reduce((prev, field) => {
    const { name, ...rest } = field;
    // eslint-disable-next-line no-param-reassign
    prev[name] = rest;
    return prev;
  }, {});
  Object.keys(fields).reduce((prev, name) => {
    if (richTextFields.includes(name)) {
      // eslint-disable-next-line no-param-reassign
      prev[name] = {}; // richText всегда i18n
      locales.forEach(locale => {
        if (fields[name][locale]) {
          // eslint-disable-next-line no-param-reassign
          prev[name][locale] = JSON.parse(fields[name][locale]);
        }
      });
    } else if (subDocumentFieldsObject[name]) {
      const { array, attributes } = subDocumentFieldsObject[name];
      if (array) {
        // eslint-disable-next-line no-param-reassign
        prev[name] = [];
        fields[name].forEach((item, i) => {
          // eslint-disable-next-line no-param-reassign
          prev[name][i] = {};
          // eslint-disable-next-line no-param-reassign
          prev[name][i] = unpackFields0(
            fields[name][i],
            attributes,
            prev[name][i],
          );
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[name] = {};
        // eslint-disable-next-line no-param-reassign
        prev[name] = unpackFields0(fields[name], attributes, prev[name]);
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      prev[name] = fields[name];
    }
    return prev;
  }, result);
  return result;
};

const unpackFields = (fields, thingConfig) => {
  const obj = unpackFields0(fields, thingConfig);

  // убираем все служебные поля __typename, в любом метсе иерархии
  const flattenObj = flat(obj, { delimiter: ':' });
  Object.keys(flattenObj).forEach(key => {
    if (key === '__typename' || key.search(/:__typename$/) !== -1) {
      delete flattenObj[key];
    }
  });
  return unflatten(flattenObj, { delimiter: ':' });
};

export default unpackFields;
