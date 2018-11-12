/* eslint-disable no-underscore-dangle, no-throw-literal, import/prefer-default-export */
import jwt from 'jsonwebtoken';

import { auth } from '../../../config';

// ----------------------------------------------------------------------
// утилита после аутентификации на сервере устанавливает куки и ...
// ... возвращает только те поля которые могут понадобиться
// userFromDb - данные по пользователю полученные из базы данных
// context - контекст выполнения graphql запроса

export const setAuthStuff = (userFromDb, { response }) => {
  const { _id, email, role } = userFromDb;
  const user = { _id, email, role };
  // убираем куки с путем для перехода
  const expiresIn = auth.jwt.expires;
  const token = jwt.sign(user, auth.jwt.secret, { expiresIn });
  // на сервере устанавливаем куки недоступные для прочтения javascriptom на клиенте
  // !!!!!!!! там же добавить secure: true когда будет работать под ssl
  response.cookie('id_token', token, {
    maxAge: 1000 * expiresIn,
    path: '/',
    httpOnly: true,
  });
  return user;
};
