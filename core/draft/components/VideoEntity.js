import React from 'react';
import PropTypes from 'prop-types';

const style = {
  width: '100%',
};

const VideoEntity = props => {
  const { src } = props;
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video alt="" src={src} style={style} />;
};
VideoEntity.propTypes = {
  src: PropTypes.string.isRequired,
};

export default VideoEntity;
