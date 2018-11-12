/* eslint-disable jsx-a11y/no-static-element-interactions, no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';

import { List } from 'material-ui/List';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';

import messages from '../searchMessages';

export const preThingSearchList = (props, context) => {
  const { data: { loading }, intl: { formatMessage }, query } = props;
  const { muiTheme } = context;

  let listOfThings;
  if (loading) {
    listOfThings = <LinearProgress style={{ marginTop: '40px' }} />;
  } else {
    listOfThings = props.composeListItems(props, context);
  }

  const queryColor = muiTheme.palette.accent3Color;
  const searchQuery = query.q && '';
  return (
    <div>
      <h1 style={{ lineHeight: '120%' }}>
        {`${formatMessage(messages.SearchFor)}:`}{' '}
        <span style={{ color: queryColor }}>{`${searchQuery}`}</span>
      </h1>
      <h2 style={{ paddingTop: '8px' }}>
        {`${formatMessage(messages.Hits)}:`}{' '}
        {loading ? (
          <CircularProgress color={queryColor} size={24} thickness={3} />
        ) : (
          <span style={{ color: queryColor }}>{props.data.search.length}</span>
        )}
      </h2>
      <List>{listOfThings}</List>
    </div>
  );
};

preThingSearchList.propTypes = {
  composeListItems: PropTypes.func.isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    search: PropTypes.array,
  }).isRequired,
  intl: intlShape.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  pathname: PropTypes.string.isRequired, // используется в utils
  query: PropTypes.objectOf(PropTypes.string).isRequired,
};

preThingSearchList.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = ({ runtime: { pathname, query } }) => ({
  pathname,
  query,
});

export default connect(mapStateToProps)(preThingSearchList);
