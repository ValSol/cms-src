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
import asyncValidate from './asyncValidate';
import validate from './validate';

import ButtonWithCircularProgress from '../../../../../components/ButtonWithCircularProgress';
import { appMessages } from '../../../../../appConfig/messages';
import userRouteMessages from '../../../userRouteMessages';

const handleButtonClick = () => {
  // по клику переход к регистрации
  const { pathname } = history.location;
  // определяем absoluteSigninPath, как ближайший путь
  // для которого используется роут: signup
  const absoluteSigninPath = getPathForRoute(pathname, 'signIn');
  goToAbsolutePath(absoluteSigninPath);
};
const SignUpForm = props => {
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
      <h1>{formatMessage(appMessages.RegistrationOnApp)}</h1>
      {error ? (
        <Divider
          style={{ marginTop: '16px', backgroundColor: colors.red500 }}
        />
      ) : (
        <Divider style={{ marginTop: '16px' }} />
      )}
      {error && (
        <div style={{ color: colors.red500, marginTop: '8px' }}>{error}</div>
      )}
      <form onSubmit={handleSubmit} id="SignupForm">
        <div>
          <Field
            id="emailSignUpForm"
            name="email"
            label={formatMessage(userRouteMessages.Email)}
            normalize={v => (v ? v.trim() : v)} // eslint-disable-line no-confusing-arrow
            component={ReduxTextField}
          />
        </div>
        <div>
          <Field
            id="passwordSignUpForm"
            name="password"
            label={formatMessage(userRouteMessages.Password)}
            type="password"
            component={ReduxTextField}
          />
        </div>
        <div>
          <Field
            id="password2SignUpForm"
            name="password2"
            label={formatMessage(userRouteMessages.Password2)}
            type="password"
            component={ReduxTextField}
          />
        </div>
        <div>
          <RaisedButton
            label={formatMessage(userRouteMessages.GoToTheEntrance)}
            style={style.Button}
            onClick={handleButtonClick}
            fullWidth={mediaType === 'extraSmall'}
            primary
          />
          {'  '}
          <ButtonWithCircularProgress
            disabled={!valid || pristine}
            fullWidth={mediaType === 'extraSmall'}
            label={formatMessage(userRouteMessages.Register)}
            style={style.Button}
            submitting={submitting}
          />
        </div>
      </form>
    </div>
  );
};

SignUpForm.propTypes = {
  error: PropTypes.string, // eslint-disable-line react/require-default-props
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  handleSubmit: PropTypes.func.isRequired,
  mediaType: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

const reduxSignUpForm = reduxForm({
  form: 'SignUpForm', // a unique identifier for this form
  touchOnBlur: true,
  touchOnChange: false,
  validate,
  asyncValidate,
  asyncBlurFields: ['email'],
})(SignUpForm);

const mapStateToProps = ({
  browser: { mediaType },
  auth, // будем использовать в onSubmitToSignUp функции
}) => ({
  mediaType,
  auth,
});

export default connect(mapStateToProps)(reduxSignUpForm);
