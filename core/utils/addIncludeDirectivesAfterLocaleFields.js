import deepEqual from 'deep-equal';

import { locales } from '../../appConfig';

// вспомогательная утилита служащая для подготовки полей
// для утилиты composeGql, таким образом что поля i18n поля типа
// { uk: null, ru: null, en: null } заменяются на поля с директивами include
// fields - объект задающий иерархию возвращаемых полей
// result - новый объект в который помещается результирующая функция

let langs;
// кеш поля с полным набором локалей
// снабженных директивами include
// типа: { 'uk @include(if: $uk)': null,
//         'ru @include(if: $ru)': null,
//         'en @include(if: $en)': null }
let langsWithInclude;
const addIncludeDirectivesAfterLocaleFields = (fields, result = {}) => {
  langs =
    langs ||
    locales.reduce((prev, locale) => ({ ...prev, [locale]: null }), {});
  langsWithInclude =
    langsWithInclude ||
    locales.reduce(
      (prev, locale) => ({
        ...prev,
        [`${locale} @include(if: $${locale})`]: null,
      }),
      {},
    );
  Object.keys(fields).forEach(key => {
    if (fields[key] === null) {
      // eslint-disable-next-line no-param-reassign
      result[key] = null;
    } else if (deepEqual(fields[key], langs)) {
      // eslint-disable-next-line no-param-reassign
      result[key] = langsWithInclude;
    } else {
      // eslint-disable-next-line no-param-reassign
      result[key] = {};
      addIncludeDirectivesAfterLocaleFields(fields[key], result[key]);
    }
  });
  return result;
};

export default addIncludeDirectivesAfterLocaleFields;
