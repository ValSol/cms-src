import React, { Component } from 'react';
import { intlShape } from 'react-intl';
import Paper from 'material-ui/Paper';

import { paperPadding } from '../../../appConfig';
import messages from './noJsMessages';

export class NoJs extends Component {
  componentDidMount() {
    // если js работает, перегружаем страницу с переходом на первую страницу
    if (process.env.BROWSER) {
      window.location.replace('/');
    }
  }
  render() {
    const { intl: { formatMessage } } = this.context;

    return (
      <Paper style={{ padding: `${paperPadding}px` }}>
        <h1 style={{ textAlign: 'center' }}>
          {formatMessage(messages.JavaScriptIsNotEnabled)}
        </h1>
      </Paper>
    );
  }
}

NoJs.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default NoJs;
