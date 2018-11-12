import React, { Component } from 'react';
import { intlShape } from 'react-intl';

import messages from './homeMessages';

class Home extends Component {
  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div>
        <h1>
          {formatMessage(messages.ProtectionOfIntellectualPropertyInUkraine)}
        </h1>
      </div>
    );
  }
}

// указываем как необязательный проп
// иначе предупреждение при получении html c сервера
Home.propTypes = {
  intl: intlShape, // eslint-disable-line react/require-default-props
};
Home.defaultProps = {
  // intl: null,
};

export default Home;
