/* eslint-disable no-underscore-dangle */
import React from 'react';

import { SubmissionError, destroy } from 'redux-form';

import { getThingConfig, thingNames } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import SignUpForm from './components/SignUpForm';
import mutation from './signUp.graphql';
import { redirectAfterSignin } from '../utils';

const onSubmitToSignUp = (args, dispatch, props) => {
  const { client } = props;

  // получаем содержимое кэша соответствующе запросу списка статей
  const { email, password } = args;
  const variables = { email, password };
  return client
    .mutate({ mutation, variables })
    .then(({ data }) => {
      if (data && data.signup && data.signup.email === email) {
        // получаем данные по пользователю кроме служебного поля __typename
        // eslint-disable-next-line no-unused-vars
        const { __typename, ...user } = data.signup;
        // удаляем форму чтобы не мигало повторным отображением отработанной формы
        dispatch(destroy('SignUpForm'));
        // отрабатываем вход в систему на клиенте
        redirectAfterSignin(user, dispatch, props);
      } else {
        throw new SubmissionError({ _error: 'FailureOfSignup' });
      }
    })
    .catch(err => {
      if (err._error) throw new SubmissionError(err);
      // если случились какие-то ошибки
      throw new SubmissionError({ _error: 'FailureOfSignup' });
    });
};

export default context => {
  const { client, intl: { messages: allMessages } } = context;
  const [thingName] = thingNames;
  const { sideNavSectionsForContent } = getThingConfig(thingName);
  return {
    title: allMessages['Sign.SignUp'],
    component: (
      <Layout2
        sideNavSections={sideNavSectionsForContent}
        thingName={thingName}
      >
        <SignUpForm onSubmit={onSubmitToSignUp} client={client} />
      </Layout2>
    ),
  };
};
