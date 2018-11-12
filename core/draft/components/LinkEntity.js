import React from 'react';
import PropTypes from 'prop-types';

import Link2 from '../../../components/Link2';

const LinkForDraftEntity = (props, context) => {
  const { href } = props.contentState.getEntity(props.entityKey).getData();
  const { muiTheme: { palette } } = context;
  return (
    <Link2 color={palette.primary1Color} href={href}>
      {props.children}
    </Link2>
  );
};

LinkForDraftEntity.propTypes = {
  children: PropTypes.node.isRequired,
  contentState: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.func, PropTypes.object]),
  ).isRequired,
  entityKey: PropTypes.string.isRequired,
};

LinkForDraftEntity.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default LinkForDraftEntity;
