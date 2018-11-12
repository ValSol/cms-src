// *************************************************************************
// будем использовать locales для автоматической загрузки тех локалей которые нужны
import { locales } from './appConfig';
// *************************************************************************

const readyStates = new Set(['complete', 'loaded', 'interactive']);

function loadMainClient() {
  const main = require('./client').default; // eslint-disable-line global-require
  main();
}

function run() {
  // Run the application when both DOM is ready and page content is loaded
  if (readyStates.has(document.readyState) && document.body) {
    loadMainClient();
  } else {
    document.addEventListener('DOMContentLoaded', loadMainClient, false);
  }
}

if (!global.Intl) {
  // You can show loading banner here
  // *************************************************************************
  // формируем массив данных для require.ensure
  const localData = ['intl'];
  locales.reduce((prev, locale) => {
    prev.push(`intl/locale-data/jsonp/${locale}.js`);
    return prev;
  }, localData);
  // *************************************************************************
  require.ensure(
    // *************************************************************************
    // скрываем данные RSK ...
    // [
    // Add all large polyfills here
    // 'intl',
    /* @intl-code-template 'intl/locale-data/jsonp/${lang}.js', */
    // 'intl/locale-data/jsonp/en.js',
    // 'intl/locale-data/jsonp/ru.js',
    // 'intl/locale-data/jsonp/uk.js',
    /* @intl-code-template-end */
    // ],
    // ... а добавляем динамически сформированные данные
    localData,
    // *************************************************************************
    require => {
      // and require them here
      require('intl');
      // ***********************************************************************
      // скрываем данные RSK ...
      // TODO: This is bad. You should only require one language dynamically
      /* @intl-code-template require('intl/locale-data/jsonp/${lang}.js'); */
      // require('intl/locale-data/jsonp/en.js');
      // require('intl/locale-data/jsonp/ru.js');
      // require('intl/locale-data/jsonp/uk.js');
      /* @intl-code-template-end */
      // ***********************************************************************
      // ... подгружаем данные динамически
      // eslint-disable-next-line import/no-dynamic-require
      locales.forEach(locale => require(`intl/locale-data/jsonp/${locale}.js`));
      // ***********************************************************************
      run();
    },
    'polyfills',
  );
} else {
  run();
}
