import React from 'react';
import PropTypes from 'prop-types';

import { components, paperPadding } from '../../appConfig';

const Footer2 = ({ paddingLeft, withMargin }) => {
  const style = {
    bottom: '0px',
    color: 'gray',
    width: '100%',
    paddingBottom: `${paperPadding}px`,
  };

  if (withMargin) {
    style.paddingBottom = `${paperPadding / 2}px`;
    style.paddingTop = `${paperPadding / 2}px`;
  }

  const { Footer } = components;
  return (
    <footer style={style}>
      <div
        style={{
          marginLeft: `${paperPadding + paddingLeft}px`,
        }}
      >
        <Footer />
      </div>
    </footer>
  );
};

Footer2.propTypes = {
  paddingLeft: PropTypes.number.isRequired,
  withMargin: PropTypes.bool.isRequired,
};

export default Footer2;
