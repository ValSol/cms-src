/* eslint-disable import/prefer-default-export */

import {
  AXIOS_INITIAL,
  AXIOS_REQUEST,
  AXIOS_REQUEST_SUCCESS,
  AXIOS_REQUEST_FAIL,
} from '../constants';

// id -  используем чтобы определять для какого окна редактора
// произведен запрос
export function axiosRequest({ id }) {
  return {
    type: AXIOS_REQUEST,
    id,
  };
}

export function axiosRequestFail({ id, error }) {
  return {
    type: AXIOS_REQUEST_FAIL,
    id,
    error,
  };
}

export function axiosRequestSuccess({ id }) {
  return {
    type: AXIOS_REQUEST_SUCCESS,
    id,
  };
}

export function axiosInitial() {
  return {
    type: AXIOS_INITIAL,
  };
}
