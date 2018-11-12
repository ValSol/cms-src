/* eslint-disable no-underscore-dangle, no-throw-literal */
import React from 'react';

import { SubmissionError, destroy } from 'redux-form';

import { getThingConfig, thingNames } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import SignInForm from './components/SignInForm';
import mutation from './signIn.graphql';
import { redirectAfterSignin } from '../utils';

const onSubmitToSignUp = (args, dispatch, props) => {
  const { client } = props;

  // получаем содержимое кэша соответствующе запросу списка статей
  const { email, password } = args;
  const variables = { email, password };
  return client
    .mutate({
      mutation,
      variables,
    })
    .then(({ data }) => {
      if (data && data.signin && data.signin.email === email) {
        // получаем данные по пользователю кроме служебного поля __typename
        // eslint-disable-next-line no-unused-vars
        const { __typename, ...user } = data.signin;
        // удаляем форму чтобы не мигало повторным отображением отработанной формы
        dispatch(destroy('SignInForm'));
        // отрабатываем вход в систему на клиенте
        redirectAfterSignin(user, dispatch, props);
      } else {
        throw new SubmissionError({ _error: 'FailureOfSignin' });
      }
    })
    .catch(err => {
      if (err._error) throw new SubmissionError(err);
      // если случились какие-то ошибки
      throw new SubmissionError({ _error: 'FailureOfSignin' });
    });
};

export default context => {
  const { client, intl: { messages: allMessages } } = context;
  const [thingName] = thingNames;
  const { sideNavSectionsForContent } = getThingConfig(thingName);
  return {
    title: allMessages['Sign.SignIn'],
    component: (
      <Layout2
        sideNavSections={sideNavSectionsForContent}
        thingName={thingName}
      >
        <SignInForm onSubmit={onSubmitToSignUp} client={client} />
      </Layout2>
    ),
  };
};
