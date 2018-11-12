/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import deepForceUpdate from 'react-deep-force-update';
import queryString from 'query-string';
import { createPath } from 'history/PathUtils';
import { addLocaleData } from 'react-intl';
// *****************************
// прячем импорт intl данных
// This is so bad: requiring all locale if they are not needed?
/* @intl-code-template import ${lang} from 'react-intl/locale-data/${lang}'; */
// import en from 'react-intl/locale-data/en';
// import cs from 'react-intl/locale-data/cs';
/* @intl-code-template-end */
// *****************************
// здесь импортируем ДОПОЛНИТЕЛЬНЫЕ модули
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import { calculateResponsiveState } from 'redux-responsive';
// *****************************

import App from './components/App';
import createFetch from './createFetch';
import configureStore from './store/configureStore';
import { updateMeta } from './DOMUtils';
import history from './history';
import createApolloClient from './core/createApolloClient';
import router from './router';
// import { getIntl } from './actions/intl';
// *****************************
// здесь импортируем ДОПОЛНИТЕЛЬНЫЕ модули
import { /* lightBaseTheme, */ locales } from './appConfig';
import { getIntl, setLocale } from './actions/intl';
import { getLocale } from './core/utils';
import { setRuntimeVariable } from './actions/runtime';
// *****************************

// *****************************
// прячем инициализацию intl данных ...
/* @intl-code-template addLocaleData(${lang}); */
// addLocaleData(en);
// addLocaleData(cs);
/* @intl-code-template-end */
// ********************
// ... и добавляем динамическую подргрузку intl данных и инициализацию данных
locales.forEach(locale => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const data = require(`react-intl/locale-data/${locale}`);
  addLocaleData(data);
});

// Universal HTTP client
const fetch = createFetch(window.fetch, {
  baseUrl: window.App.apiUrl,
});

const apolloClient = createApolloClient();

// Initialize a new Redux store
// http://redux.js.org/docs/basics/UsageWithReact.html
const store = configureStore(window.App.state, {
  apolloClient,
  fetch,
  history,
});

// Global (context) variables that can be easily accessed from any React component
// https://facebook.github.io/react/docs/context.html
const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles) => {
    // eslint-disable-next-line no-underscore-dangle
    const removeCss = styles.map(x => x._insertCss());
    return () => {
      removeCss.forEach(f => f());
    };
  },
  // For react-apollo
  client: apolloClient,
  store,
  storeSubscription: null,
  // Universal HTTP client
  fetch,
  // intl instance as it can be get with injectIntl
  intl: store.dispatch(getIntl()),
};

const container = document.getElementById('app');
let currentLocation = history.location;
let appInstance;

const scrollPositionsHistory = {};

// Re-render the app when window.location changes
async function onLocationChange(location, action) {
  // Remember the latest scroll position for the previous location
  scrollPositionsHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  };
  // Delete stored scroll position for next page if any
  if (action === 'PUSH') {
    delete scrollPositionsHistory[location.key];
  }
  currentLocation = location;

  // ***************************************************************************
  // проверяем нет ли смены локали в результате изменения адреса
  const { locale } = store.getState().intl;
  const newLocale = getLocale(location.pathname);
  if (locale !== newLocale) {
    await store.dispatch(setLocale({ locale: newLocale }));
  }
  // ***************************************************************************
  context.intl = store.dispatch(getIntl());

  const isInitialRender = !action;
  try {
    context.pathname = location.pathname;
    context.query = queryString.parse(location.search);
    context.locale = store.getState().intl.locale;

    // Traverses the list of routes in the order they are defined until
    // it finds the first route that matches provided URL path string
    // and whose action method returns anything other than `undefined`.
    const route = await router.resolve(context);

    // Prevent multiple page renders during the routing process
    if (currentLocation.key !== location.key) {
      return;
    }

    if (route.redirect) {
      history.replace(route.redirect);
      return;
    }

    // *************************************************************************
    // завершаем установку первоначальных значений в ридакс сторе
    // исходя из данных полученных при отработке Универсальным Роутером
    // ---
    // если напрямую устанавалитаь query: queryString.parse(location.search)
    // получаем ошибку:
    // "Warning: Failed prop type: propValue.hasOwnProperty is not a function"
    // поэтому дерструктурируем и обратно конструируем
    context.store.dispatch(
      setRuntimeVariable({
        name: 'query',
        value: { ...queryString.parse(location.search) },
      }),
    );
    context.store.dispatch(
      setRuntimeVariable({
        name: 'pathname',
        value: location.pathname,
      }),
    );
    context.store.dispatch(
      setRuntimeVariable({
        name: 'error',
        value: '',
      }),
    );
    // *************************************************************************

    const renderReactApp = isInitialRender ? ReactDOM.hydrate : ReactDOM.render;

    // **********************************
    // включаем использование material-ui
    const theme = createMuiTheme();
    // **********************************
    appInstance = renderReactApp(
      // <App context={context}>{route.component}</App>,
      // **********************************
      // включаем использование material-ui
      <MuiThemeProvider theme={theme}>
        <App context={context}>
          <V0MuiThemeProvider>{route.component}</V0MuiThemeProvider>
        </App>
      </MuiThemeProvider>,
      // **********************************
      container,
      () => {
        if (isInitialRender) {
          // Switch off the native scroll restoration behavior and handle it manually
          // https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
          if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
          }
          const elem = document.getElementById('css');
          if (elem) elem.parentNode.removeChild(elem);
          // *******************************************************************
          // добавляем удаление the server-side injected jssStyles
          const jssStyles = document.getElementById('jss-server-side');
          if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
          }
          // *******************************************************************
          // ПОСЛЕ гидрации компоненты обновляем redux store чтобы ...
          // ... если mediaType не соовтетствует определенному на сервере ...
          // ... компонента была перпостроена для нового mediaType
          context.store.dispatch(calculateResponsiveState(window));
          // *******************************************************************
          return;
        }

        document.title = route.title;

        updateMeta('description', route.description);
        // Update necessary tags in <head> at runtime here, ie:
        // updateMeta('keywords', route.keywords);
        // updateCustomMeta('og:url', route.canonicalUrl);
        // updateCustomMeta('og:image', route.imageUrl);
        // updateLink('canonical', route.canonicalUrl);
        // etc.

        let scrollX = 0;
        let scrollY = 0;
        const pos = scrollPositionsHistory[location.key];
        if (pos) {
          scrollX = pos.scrollX;
          scrollY = pos.scrollY;
        } else {
          const targetHash = location.hash.substr(1);
          if (targetHash) {
            const target = document.getElementById(targetHash);
            if (target) {
              scrollY = window.pageYOffset + target.getBoundingClientRect().top;
            }
          }
        }

        // Restore the scroll position if it was saved into the state
        // or scroll to the given #hash anchor
        // or scroll to top of the page
        window.scrollTo(scrollX, scrollY);

        // Google Analytics tracking. Don't send 'pageview' event after
        // the initial rendering, as it was already sent
        if (window.ga) {
          window.ga('send', 'pageview', createPath(location));
        }
      },
    );
  } catch (error) {
    if (__DEV__) {
      throw error;
    }

    console.error(error);

    // Do a full page reload if error occurs during client-side navigation
    if (!isInitialRender && currentLocation.key === location.key) {
      console.error('RSK will reload your page after error');
      window.location.reload();
    }
  }
}

let isHistoryObserved = false;
export default function main() {
  // Handle client-side navigation by using HTML5 History API
  // For more information visit https://github.com/mjackson/history#readme
  currentLocation = history.location;
  if (!isHistoryObserved) {
    isHistoryObserved = true;
    history.listen(onLocationChange);
  }
  onLocationChange(currentLocation);
}

// globally accesible entry point
window.RSK_ENTRY = main;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
  module.hot.accept('./router', () => {
    if (appInstance && appInstance.updater.isMounted(appInstance)) {
      // Force-update the whole tree, including components that refuse to update
      deepForceUpdate(appInstance);
    }

    onLocationChange(currentLocation);
  });
}
