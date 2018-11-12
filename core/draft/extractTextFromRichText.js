import { isString } from '../utils';

// функци возвращает текстовую часть из draft.js RichText формата
// obj - объект с i18n полями, для каждой локали
/*  функция возрващает объект в которой присутствует
 plain text поле для каждой локали
например:
  {
    uk: '{"entityMap":{},"blocks":[
      {"text":"Контент українською"},
      {"text":"строка 2"},
      {"text":"строка 3"},
    ]}',
    ru: '{"entityMap":{},"blocks":[
      {"text":"Контент по русски"},
      {"text":"строка 2"},
      {"text":"строка 3"},
    ]}',
    en: '{"entityMap":{},"blocks":[
      {"text":"Content in English"},
      {"text":"line 2"},
      {"text":"line 3"},
    ]}',
  },
locale = 'uk'
преобразуется в
  'Контент українською\nстрока 2\nстрока 3'
*/
const extractTextFromRichText = (arg, locale) => {
  const obj = isString(arg[locale]) ? JSON.parse(arg[locale]) : arg[locale];

  return obj.blocks.map(({ text }) => text).join('\n');
};

export default extractTextFromRichText;
