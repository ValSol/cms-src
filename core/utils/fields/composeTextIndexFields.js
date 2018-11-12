import extractTextFromRichText from '../../draft/extractTextFromRichText';

// функция готовит объект для загрузки в коллекцию текстовых индексов
// для уазанной locale
// obj - объект со всеми полями i18n полями
// locale - локаль для которой вычленяются текстовые индексируемые поля
/*  функция возрващает объект в которой присутствует
 plain text поле для каждой локали
 при наличии поля _id его значение присваивается полю _item
например:
obj = {
  _id: '5a6ed67bb9cc9613c0be746',
  subject: ['patent'],
  section: 'info'
  slug: 'test',
  title: {
    uk: 'Заголовок українською',
    ru: 'Название по русски',
    en: 'Title in English',
  },
  content: {
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
}
locale = 'uk'
преобразуется в
  {
    title: 'Заголовок українською',
    content: 'Контент українською\nстрока 2\nстрока 3',
    _item: '5a6ed67bb9cc9613c0be746',
  }
*/
const composeTextIndexFields = (obj, locale, thingConfig) => {
  const { textIndexFields, richTextFields } = thingConfig;

  // получаем список тех полей которые должны быть проиндексированы
  const requiredFields = textIndexFields.map(({ name }) => name);

  const composedFields = {};
  Object.keys(obj).forEach(key => {
    if (requiredFields.indexOf(key) !== -1 && obj[key][locale]) {
      composedFields[key] =
        richTextFields.indexOf(key) !== -1
          ? extractTextFromRichText(obj[key], locale)
          : obj[key][locale];
    }
  });
  const { _id } = obj;
  // eslint-disable-next-line no-underscore-dangle
  if (_id) composedFields._item = _id;

  return composedFields;
};

export default composeTextIndexFields;
