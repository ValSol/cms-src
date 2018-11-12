/* eslint-disable no-underscore-dangle, no-throw-literal */
import Promise from 'bluebird';
import isEmail from 'validator/lib/isEmail';

import query from './emailValidate.graphql';

const asyncValidateForSignUp = ({ email }, dispatch, { client }) => {
  // если email не указан или он неправильный ...
  // ... валидацию не проводим
  if (!email || !isEmail(email)) return Promise.resolve();

  return client
    .query({
      query,
      variables: {
        email,
      },
    })
    .then(({ data, errors }) => {
      if (errors) throw { _error: 'DataProcessingFailure' };
      if (data && data.user && data.user.email) {
        throw { email: 'EmailAlreadyTaken' };
      }
      return Promise.resolve();
    })
    .catch(err => {
      if (err.email) throw err;
      // если случились какие-то ошибки
      throw { _error: 'InternetConnectionError' };
    });
};
export default asyncValidateForSignUp;
