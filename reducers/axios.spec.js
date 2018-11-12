/* eslint-env jest */

import {
  AXIOS_INITIAL,
  AXIOS_REQUEST,
  AXIOS_REQUEST_SUCCESS,
  AXIOS_REQUEST_FAIL,
} from '../constants';

import reducer, { PROGRESS, SUCCESS, FAIL } from './axios';

describe('axios reducer', () => {
  const id = 'uk12345';
  test('should return the new axios state', () => {
    const newStore = reducer(undefined, {});
    expect(newStore).toEqual({ requestState: null, error: null });
  });

  test('should set null axios state when axios initial', () => {
    const store = { requestState: [id, SUCCESS], error: null };
    const action = {
      type: AXIOS_INITIAL,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ requestState: null, error: null });
  });

  test('should set PROGRESS axios state when axios request', () => {
    const store = { requestState: null, error: null };
    const action = {
      id,
      type: AXIOS_REQUEST,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ requestState: [id, PROGRESS], error: null });
  });

  test('should set SUCCESS axios state when axios success request', () => {
    const store = { requestState: [id, PROGRESS], error: null };
    const action = {
      id,
      type: AXIOS_REQUEST_SUCCESS,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ requestState: [id, SUCCESS], error: null });
  });

  test('should set FAIL axios state when axios fail request', () => {
    const store = { requestState: [id, PROGRESS], error: null };
    const error = 'error';
    const action = {
      id,
      type: AXIOS_REQUEST_FAIL,
      error,
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual({ requestState: [id, FAIL], error });
  });
});
