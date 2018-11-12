import { locales } from '../../appConfig';

// получаем переводы из папки '/messages' для заданной локали
// преобразуем их из массива в объекты
const messagesForLocale = locale => {
  if (!locales.includes(locale)) {
    throw new TypeError(`locale="${locale}" don't use!`);
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`../../messages/${locale}.json`).reduce((prev, message) => {
    // eslint-disable-next-line no-param-reassign
    prev[message.id] = message.message;
    return prev;
  }, {});
};

export default messagesForLocale;
