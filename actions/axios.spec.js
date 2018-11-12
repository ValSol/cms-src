/* eslint-env jest */

import {
  AXIOS_REQUEST,
  AXIOS_REQUEST_FAIL,
  AXIOS_REQUEST_SUCCESS,
} from '../constants';

import { axiosRequest, axiosRequestFail, axiosRequestSuccess } from './axios';

describe('axiosRequest action', () => {
  const id = 'uk12345';
  test('should create an action for axios request', () => {
    const expectedAction = {
      type: AXIOS_REQUEST,
      id,
    };
    expect(axiosRequest({ id })).toEqual(expectedAction);
  });
  test('should create an action for axios request fail', () => {
    const error = 'error';
    const expectedAction = {
      type: AXIOS_REQUEST_FAIL,
      id,
      error,
    };
    expect(axiosRequestFail({ id, error })).toEqual(expectedAction);
  });
  test('should create an action for axios request success', () => {
    const expectedAction = {
      type: AXIOS_REQUEST_SUCCESS,
      id,
    };
    expect(axiosRequestSuccess({ id })).toEqual(expectedAction);
  });
});
