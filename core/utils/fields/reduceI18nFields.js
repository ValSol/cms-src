/*  функция возрващает объект в котором
i18n поле заменяется значениями для указанного языка
например, если lang='uk':
  title: {
    uk: 'Назва',
    ru: 'Заголовок',
    en: 'Title',
  },
  title: 'Назва',
*/
// obj - объект содержащий i18n поля
// lang - язык значения для которого используются
const reduceI18nFields = (obj, lang, thingConfig) => {
  const { i18nFields } = thingConfig;

  const result = { ...obj };
  i18nFields.forEach(({ name }) => {
    if (result[name] && result[name][lang]) {
      result[name] = result[name][lang];
    }
  });
  return result;
};

export default reduceI18nFields;
