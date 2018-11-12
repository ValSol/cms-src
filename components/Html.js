/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import config from '../config';

// ****************************************************************************
// добавляем для отработки роута noJs
import { composePathWithLocale } from '../core/utils';
import { getPathForRoute } from '../routes/routesUtils';
// ****************************************************************************

/* eslint-disable react/no-danger */

class Html extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    // ***********************************
    // !!! ВРЕМЕННО делаем НЕ обязательым
    description: PropTypes.string,
    // ***********************************
    styles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        cssText: PropTypes.string.isRequired,
      }).isRequired,
    ),
    scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
    // eslint-disable-next-line react/forbid-prop-types
    app: PropTypes.object.isRequired,
    children: PropTypes.string.isRequired,
    // *************************************************************************
    // добавляем путь в Html для nojs, чтобы при построении Html ...
    // не происходило зацикливания убирать раздел <noscript></noscript>
    pathname: PropTypes.string.isRequired,
    // *************************************************************************
  };

  static defaultProps = {
    // ***********************************
    description: '', // !!!! ВРЕМЕННО
    // ***********************************
    styles: [],
    scripts: [],
  };

  render() {
    // const { title, description, styles, scripts, app, children, pathname } = this.props;
    // *************************************************************************
    // дополнительн будем использовать pathname
    const {
      title,
      description,
      styles,
      scripts,
      app,
      children,
      pathname,
    } = this.props;
    // определяем путь соответствующий роуту noJs
    const noJsPath = composePathWithLocale(
      getPathForRoute(pathname, 'noJs'),
      app.lang,
    );
    // *************************************************************************
    return (
      <html className="no-js" lang={app.lang}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          {/* ************************************************************** */}
          {/* добавляем отрботку варианта выключенного JasvaScript */}
          {pathname !== noJsPath && (
            <noscript>
              <meta httpEquiv="Refresh" content={`0;URL=${noJsPath}`} />
            </noscript>
          )}
          {/* ************************************************************** */}
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {scripts.map(script => (
            <link key={script} rel="preload" href={script} as="script" />
          ))}
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/icon.png" />
          {styles.map(style => (
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
            />
          ))}
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
          <script
            dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
          />
          {scripts.map(script => <script key={script} src={script} />)}
          {config.analytics.googleTrackingId && (
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                  `ga('create','${
                    config.analytics.googleTrackingId
                  }','auto');ga('send','pageview')`,
              }}
            />
          )}
          {config.analytics.googleTrackingId && (
            <script
              src="https://www.google-analytics.com/analytics.js"
              async
              defer
            />
          )}
        </body>
      </html>
    );
  }
}

export default Html;
