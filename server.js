/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import Promise from 'bluebird';
import express from 'express';
import cookieParser from 'cookie-parser';
// import requestLanguage from 'express-request-language';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import { graphql } from 'graphql';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { getDataFromTree } from 'react-apollo';
import PrettyError from 'pretty-error';
import { IntlProvider } from 'react-intl';
// *****************************
// здесь импортируем ДОПОЛНИТЕЛЬНЫЕ модули
import fs from 'fs';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
} from '@material-ui/core/styles'; // v1.x
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { MuiThemeProvider as V0MuiThemeProvider } from 'material-ui';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
// *****************************

import './serverIntlPolyfill';
import createApolloClient from './core/createApolloClient';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import passport from './passport';
import router from './router';
// import models from './data/models';
import schema from './data/schema';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { setLocale } from './actions/intl';
import config from './config';
// *****************************
// здесь импортируем ДОПОЛНИТЕЛЬНЫЕ модули
import { appName, /* lightBaseTheme, */ locales } from './appConfig';
import { getLocale } from './core/utils';
import seedDb from './seedDb';
// *****************************

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
// не используем т.к. определяем язык по адресной строке браузера
/* app.use(
  requestLanguage({
    languages: config.locales,
    queryName: 'lang',
    cookie: {
      name: 'lang',
      options: {
        path: '/',
        maxAge: 3650 * 24 * 3600 * 1000, // 10 years in miliseconds
      },
      url: '/lang/{language}',
    },
  }),
); */
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// *****************************************************************************
// две вышеприведенные строки дополняем параметрами обеспечивающими обработку
// больших graphql запросов (для выполнения операции импорта)
// TODO - м.б. разрешать такое только администраторам, но как?
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 500000,
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
// *****************************************************************************

// *****************************************************************************
// Регистрируем multer чтобы загружать файлы
let storage;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  // если имеются переменные окружения с данными для подключения к AWS
  // файлы будут загружатся на s3
  const s3 = new aws.S3();
  storage = multerS3({
    acl: 'public-read',
    // D
    bucket: `images.${appName.toLowerCase}`,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, callback) {
      const { thingId, thingName } = req.body;
      callback(
        null,
        `${thingName.toLowerCase()}/${thingId}/${file.originalname}`,
      );
    },
    s3,
  });
} else {
  // в остальных случаях грузим файлы на сервер в указанную папку
  storage = multer.diskStorage({
    destination(req, file, callback) {
      const { thingId, thingName } = req.body;
      const newDestination = `./public/uploads/${thingName.toLowerCase()}/${thingId}`;
      let stat = null;
      try {
        stat = fs.statSync(newDestination);
      } catch (err) {
        fs.mkdirSync(newDestination);
      }
      if (stat && !stat.isDirectory()) {
        // eslint-disable-next-line max-len
        throw new Error(`Directory cannot be created because
  an inode of a different type exists at ${newDestination}`);
      }
      callback(null, newDestination);
    },
    filename(req, file, callback) {
      callback(null, file.originalname);
    },
  });
}
const upload = multer({ storage }).array('filesForUpload');
// *****************************************************************************
//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(passport.initialize());

app.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

//
// Register API middleware
// -----------------------------------------------------------------------------
// https://github.com/graphql/express-graphql#options
// const graphqlMiddleware = expressGraphQL((req) => ({
const graphqlMiddleware = expressGraphQL((req, res) => ({
  schema,
  graphiql: __DEV__,
  // rootValue: { request: req },
  // ****************************************
  // добавляем response - для работы с куками
  rootValue: { request: req, response: res },
  // ****************************************
  pretty: __DEV__,
}));

app.use('/graphql', graphqlMiddleware);

// *****************************************************************************
// отрабатываем загрузку файлов
app.post('/api/uploads', (req, res, next) => {
  upload(req, res, err => {
    if (err) {
      next(err);
    } else {
      const uploadedFiles = req.files
        // [filename]: `${dirForImages}/${req.body.thingId}/${filename}` }),
        .reduce((prev, { filename, key, location }) => {
          // если грузим файлы на сервер
          if (filename) {
            const { thingId, thingName } = req.body;
            return {
              ...prev,
              [filename]: `/uploads/${thingName.toLowerCase()}/${thingId}/${filename}`,
            };
          }
          // если грузим файлы на s3
          // ВНИМАНИЕ! если менять структуру адреса с загруженными файлами
          // нужно корретировать и строку [foo1, foo2, name]
          // определяющую имя загруженного файла
          // eslint-disable-next-line no-unused-vars
          const [foo1, foo2, name] = key.split('/');
          return { ...prev, [name]: location };
        }, {});
      res.send(uploadedFiles);
    }
  });
});
// *****************************************************************************
//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()));
    };

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
      apolloClient,
      schema,
      graphql,
    });

    // *******************************************************
    // преобразуем данные переменной user для передачи в store
    let user = null;
    if (req.user) {
      // если пользователь авторизирвоан - убираем куки с путем для последующего перехода
      res.cookie('next_path', '', { maxAge: -1 });
      user = { ...req.user };
      delete user.iat; // убираем чтобы не передавалось с сервера ...
      delete user.exp; // ... на клиента
    }
    // *******************************************************

    const initialState = {
      // user: req.user || null, // убираем для гигиены, используем auth
      // *********************************
      // добавляем свои начальные значения
      auth: {
        user,
        nextPath: req.cookies.next_path || null,
      },
      runtime: {
        sideNavOpen: false,
        pathname: req.path,
        query: req.query,
      },
      // *********************************
    };

    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      apolloClient,
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
      history: null,
      // ***********************************************************************
      // добавляем для установки mediaType на сервере исходя из куков
      // !!! если куков НЕТ надо БУДЕТ вычислять из req.headers['user-agent']
      initialMediaType: req.cookies.mediaType || 'large',
      // ***********************************************************************
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    store.dispatch(
      setRuntimeVariable({
        name: 'availableLocales',
        // value: config.locales,
        // **************************
        // берем locales из appConfig
        value: locales,
        // **************************
      }),
    );

    // const locale = req.language;
    // ***********************************************
    // получаем текущий язык не из бразузера или куков
    // а из адресной строки браузера
    const locale = getLocale(req.path);
    // ***********************************************
    const intl = await store.dispatch(
      setLocale({
        locale,
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      fetch,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      // Apollo Client for use with react-apollo
      client: apolloClient,
      // intl instance as it can be get with injectIntl
      intl,
      locale,
    };

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };

    // const rootComponent = <App context={context}>{route.component}</App>;
    // **********************************************
    // компонуем rootComponent включающий material-ui
    const themeV0 = getMuiTheme({ userAgent: req.headers['user-agent'] });
    const theme = createMuiTheme({ userAgent: req.headers['user-agent'] });
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();
    // const muiTheme = getMuiTheme(lightBaseTheme, {
    //   userAgent: req.headers['user-agent'],
    // });
    const rootComponent = (
      <JssProvider
        registry={sheetsRegistry}
        generateClassName={generateClassName}
      >
        <MuiThemeProvider theme={theme}>
          <App context={context}>
            <V0MuiThemeProvider muiTheme={themeV0}>
              {route.component}
            </V0MuiThemeProvider>
          </App>
        </MuiThemeProvider>
      </JssProvider>
    );

    // **********************************************

    await getDataFromTree(rootComponent);
    // this is here because of Apollo redux APOLLO_QUERY_STOP action
    await Promise.delay(0);
    data.children = await ReactDOM.renderToString(rootComponent);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
      // **********************************************
      // получаем jss-server-side
      { id: 'jss-server-side', cssText: sheetsRegistry.toString() },
      // **********************************************
    ];

    const scripts = new Set();
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);
    data.scripts = Array.from(scripts);

    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      lang: locale,
      apolloState: context.client.extract(),
    };

    // *************************************************************************
    // добавляем путь в Html для nojs, чтобы при построении Html ...
    // не происходило зацикливания убирать раздел <noscript></noscript>
    data.pathname = req.path;
    // *************************************************************************
    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const locale = req.language;
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
      app={{ lang: locale }}
    >
      {ReactDOM.renderToString(
        <IntlProvider locale={locale}>
          <ErrorPageWithoutStyle error={err} />
        </IntlProvider>,
      )}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
// const promise = models.sync().catch(err => console.error(err.stack));
/* if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}
*/
// *****************************************************************************
// добавляем подгрузку и mongodb вместо закоментированного выше кода
if (!module.hot) {
  const promises = [/* promise, */ seedDb()];

  Promise.all(promises).then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  seedDb().then(() => {
    app.hot = module.hot;
    module.hot.accept('./router');
  });
}
// *****************************************************************************

export default app;
