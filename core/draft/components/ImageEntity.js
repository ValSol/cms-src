import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

const style = {
  maxWidth: '100%',
  height: 'auto',
};

const ImageEntity = (props, context) => {
  const { caption, height, onLoad, src, width } = props;
  const { intl: { locale } } = context;
  // handleLoad - используем при первой загрузке
  // чтобы получить размеры картинки
  const handleLoad =
    !height || !width || onLoad ? event => onLoad(event, src) : null;
  const alt = caption ? caption[locale] : '';
  return (
    <img
      alt={alt}
      height={height}
      onLoad={handleLoad}
      src={src}
      style={style}
      title={alt}
      width={width}
    />
  );
};

ImageEntity.propTypes = {
  caption: PropTypes.objectOf(PropTypes.string),
  height: PropTypes.string,
  onLoad: PropTypes.func,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
};

ImageEntity.defaultProps = {
  caption: null,
  height: null,
  onLoad: null,
  width: null,
};

ImageEntity.contextTypes = {
  intl: intlShape,
};

export default ImageEntity;
