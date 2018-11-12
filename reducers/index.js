import { combineReducers } from 'redux';
// *****************************************************************************
// подгружаем дополнительные пакеты
import { reducer as form } from 'redux-form';
import { createResponsiveStateReducer } from 'redux-responsive';
// *****************************************************************************

// import user from './user'; // нам не нужен - есть auth
import runtime from './runtime';
import intl from './intl';
// ************************
// импортируем дополнительные reducer'ы
import auth from './auth';
import axios from './axios';
import richtexteditor from './richtexteditor';
// export default function createRootReducer() {
// *****************************************************************************
// заменяем createRootReducer без аргументов
// на createRootReducer получающий initialMediaType из server.js
export default function createRootReducer({ initialMediaType }) {
  // ***************************************************************************
  return combineReducers({
    // user, // нам не нужен - есть auth
    runtime,
    intl,
    // ************************
    // вставляем дополнительные reducer'ы
    auth,
    axios,
    browser: createResponsiveStateReducer(null, { initialMediaType }),
    form,
    richtexteditor,
  });
}
