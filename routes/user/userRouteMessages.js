import { defineMessages } from 'react-intl';
/* Используются в:
1) SignIpForm компоненте
2) SignUpForm компоненте
3) HeaderVertMenu компоненте
а также через контекст роута используются в
1) signIn роуте
2) signUp роуте
*/
export default defineMessages({
  SignIn: {
    id: 'Sign.SignIn',
    defaultMessage: 'Вход',
  },
  SignUp: {
    id: 'Sign.SignUp',
    defaultMessage: 'Регистрация',
  },
  Password: {
    id: 'Sign.Password',
    defaultMessage: 'Пароль',
  },
  Password2: {
    id: 'Sign.Password2',
    defaultMessage: 'Пароль повторно',
  },
  Email: {
    id: 'Sign.Email',
    defaultMessage: 'Электронный адрес',
  },
  TheEntranceToTheControlPanel: {
    id: 'Sign.TheEntranceToTheControlPanel',
    defaultMessage: 'Вход в панель управления',
  },
  GoToTheRegistration: {
    id: 'Sign.GoToTheRegistration',
    defaultMessage: 'Перейти к регистрации',
  },
  Enter: {
    id: 'Sign.Enter',
    defaultMessage: 'Войти',
  },
  GoToTheEntrance: {
    id: 'Sign.GoToTheEntrance',
    defaultMessage: 'Перейти на вход',
  },
  Register: {
    id: 'Sign.Register',
    defaultMessage: 'Зарегистрировать',
  },
  Signout: {
    id: 'Sign.Signout',
    defaultMessage: 'Sing Out',
  },
  FailureOfSignup: {
    id: 'Sign.FailureOfSignup',
    defaultMessage: 'Failure of signup',
  },
  FailureOfSignin: {
    id: 'Sign.FailureOfSignin',
    defaultMessage: 'Failure of signin',
  },
});
