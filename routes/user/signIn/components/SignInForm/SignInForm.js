import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { colors } from 'material-ui/styles';

import { goToAbsolutePath } from '../../../../../core/utils';
import history from '../../../../../history';
import { getPathForRoute } from '../../../../routesUtils';

import ReduxTextField from '../../../../../components/reduxFormFields/ReduxTextField';
import validate from './validate';

import ButtonWithCircularProgress from '../../../../../components/ButtonWithCircularProgress';
import userRouteMessages from '../../../userRouteMessages';

const handleButtonClick = () => {
  // по клику переход к регистрации
  const { pathname } = history.location;
  // определяем absoluteSignupPath, как ближайший путь
  // для которого используется роут: signup
  const absoluteSignupPath = getPathForRoute(pathname, 'signUp');
  goToAbsolutePath(absoluteSignupPath);
};

const SignInForm = props => {
  const {
    error,
    handleSubmit,
    intl: { formatMessage },
    mediaType,
    pristine,
    submitting,
    valid,
  } = props;

  const style = {
    Button: {
      marginTop: '16px',
      marginRight: '8px',
    },
  };

  return (
    <div>
      <h1>{formatMessage(userRouteMessages.TheEntranceToTheControlPanel)}</h1>
      {error ? (
        <Divider
          style={{ marginTop: '16px', backgroundColor: colors.red500 }}
        />
      ) : (
        <Divider style={{ marginTop: '16px' }} />
      )}
      {error && (
        <div style={{ color: colors.red500, marginTop: '8px' }}>
          {formatMessage(userRouteMessages[error])}
        </div>
      )}
      <form onSubmit={handleSubmit} id="SigninForm">
        <div>
          <Field
            id="emailSignInForm"
            name="email"
            label={formatMessage(userRouteMessages.Email)}
            normalize={v => (v ? v.trim() : v)} // eslint-disable-line no-confusing-arrow
            component={ReduxTextField}
          />
        </div>
        <div>
          <Field
            id="passwordSignInForm"
            name="password"
            label={formatMessage(userRouteMessages.Password)}
            type="password"
            component={ReduxTextField}
          />
        </div>
        <div>
          <RaisedButton
            label={formatMessage(userRouteMessages.GoToTheRegistration)}
            style={style.Button}
            onClick={handleButtonClick}
            fullWidth={mediaType === 'extraSmall'}
            primary
          />
          {'  '}
          <ButtonWithCircularProgress
            disabled={!valid || pristine}
            fullWidth={mediaType === 'extraSmall'}
            label={formatMessage(userRouteMessages.Enter)}
            style={style.Button}
            submitting={submitting}
          />
        </div>
      </form>
    </div>
  );
};

SignInForm.propTypes = {
  error: PropTypes.string, // eslint-disable-line react/require-default-props
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  handleSubmit: PropTypes.func.isRequired,
  mediaType: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

SignInForm.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const reduxSignInForm = reduxForm({
  form: 'SignInForm', // a unique identifier for this form
  touchOnBlur: true,
  touchOnChange: false,
  validate,
})(SignInForm);

const mapStateToProps = ({
  browser: { mediaType },
  auth, // будем использовать в onSubmitToSignIn функции
}) => ({
  mediaType,
  auth,
});

export default connect(mapStateToProps)(reduxSignInForm);
