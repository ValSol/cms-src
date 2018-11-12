import React from 'react';
import PropTypes from 'prop-types';

const style = {
  width: '100%',
};

const AudioEntity = props => {
  const { src } = props;
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio alt="" src={src} style={style} />;
};
AudioEntity.propTypes = {
  src: PropTypes.string.isRequired,
};

export default AudioEntity;
