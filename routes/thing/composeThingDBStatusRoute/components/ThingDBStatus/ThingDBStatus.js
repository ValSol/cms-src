import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import Divider from 'material-ui/Divider';
import LinearProgress from 'material-ui/LinearProgress';
import { colors } from 'material-ui/styles';
import { plural } from 'pluralize';

import { hasRichTextFields } from '../../../../../core/utils';
import ButtonWithCircularProgress from '../../../../../components/ButtonWithCircularProgress';
import validationMessages from '../../../../../components/validationMessages';
import dbStatusMessages from './dbStatusMessages';

class ThingDBStatus extends React.Component {
  static propTypes = {
    data: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.func,
        PropTypes.number,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    error: PropTypes.string,
    fixThings: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
  };
  static defaultProps = {
    error: '',
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  render() {
    const {
      error,
      data: { loading },
      fixThings,
      submitting,
      title,
      thingConfig,
      thingConfig: { orderedSets, textIndexFields, thingName },
    } = this.props;
    const { intl: { formatMessage } } = this.context;
    let statusInfo;
    if (loading) {
      statusInfo = <LinearProgress style={{ marginTop: '40px' }} />;
    } else {
      const { data } = this.props;
      const style = {
        Row: { marginBottom: '12px', marginTop: '12px' },
        Button: { marginLeft: '8px' },
      };
      const { excerptErrors, textIndexErrors, backLinksErrors } = data[
        `${plural(thingName.toLowerCase())}Status`
      ];

      statusInfo = (
        <div>
          {!!orderedSets.length && (
            <div>
              <h2>{formatMessage(dbStatusMessages.Excerpts)}</h2>
              <div style={style.Row}>
                {formatMessage(dbStatusMessages.Errors)}:
                <strong> {excerptErrors}</strong>
              </div>
            </div>
          )}
          {!!textIndexFields.length && (
            <div>
              <h2>{formatMessage(dbStatusMessages.TextIndexes)}</h2>
              <div style={style.Row}>
                {formatMessage(dbStatusMessages.Errors)}:
                <strong> {textIndexErrors}</strong>
              </div>
            </div>
          )}
          {!!hasRichTextFields(thingConfig) && (
            <div>
              <h2>{formatMessage(dbStatusMessages.BackLinks)}</h2>
              <div style={style.Row}>
                {formatMessage(dbStatusMessages.Errors)}:
                <strong> {backLinksErrors}</strong>
              </div>
            </div>
          )}
          {!!(excerptErrors + textIndexErrors + backLinksErrors) && (
            <ButtonWithCircularProgress
              label={formatMessage(dbStatusMessages.FixErrors)}
              onClick={fixThings}
              style={style.Button}
              submitting={submitting}
            />
          )}
        </div>
      );
    }

    return (
      <div>
        <h1>{title}</h1>
        {error ? (
          <Divider
            style={{ marginTop: '16px', backgroundColor: colors.red500 }}
          />
        ) : (
          <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
        )}
        {error && (
          <div
            style={{
              color: colors.red500,
              lineHeight: '8px',
              marginBottom: '16px',
              marginTop: '8px',
            }}
          >
            {formatMessage(validationMessages[error])}
          </div>
        )}
        {statusInfo}
      </div>
    );
  }
}

const mapStateToProps = ({ runtime: { error, loading } }) => ({
  error,
  submitting: !!loading, // чтобы undefined не было
});

export default connect(mapStateToProps)(ThingDBStatus);
