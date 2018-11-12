import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import { footerMessages } from '../../messages';

const Footer = (props, context) => {
  const {
    intl: { formatMessage },
    muiTheme: { palette: { accent1Color } },
  } = context;
  return (
    <span>
      {`${formatMessage(footerMessages.Telephone)}: `}
      <a href="tel:+380632331199" style={{ color: accent1Color }}>
        +380 44 233 11 99
      </a>
      {` © 2005-${new Date().getFullYear()} info@intellect.ua`}
    </span>
  );
};

Footer.contextTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
};

export default Footer;
