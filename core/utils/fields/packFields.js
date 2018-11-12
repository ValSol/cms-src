import { locales } from '../../../appConfig';

// проделывает операцию обратную функции unpackFields
// fields - объект содержащий поля которые надо запоковать
/*  функция возрващает объект в котором
richText поля из draft.js объектов преобразуются в JSON строки, при этом ...
... осуществляется рекурсивный обход ДЕРЕВА полей во внедренных ...
... документах (subDocumentFields)

например:
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
преобразуется в
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
*/
const packFields = (
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
          prev[name][locale] = JSON.stringify(fields[name][locale]);
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
          prev[name][i] = packFields(
            fields[name][i],
            attributes,
            prev[name][i],
          );
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[name] = {};
        // eslint-disable-next-line no-param-reassign
        prev[name] = packFields(fields[name], attributes, prev[name]);
      }
    } else {
      // eslint-disable-next-line no-param-reassign
      prev[name] = fields[name];
    }
    return prev;
  }, result);
  return result;
};

export default packFields;
