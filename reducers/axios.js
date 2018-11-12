import {
  AXIOS_INITIAL,
  AXIOS_REQUEST,
  AXIOS_REQUEST_SUCCESS,
  AXIOS_REQUEST_FAIL,
} from '../constants';

export const PROGRESS = 'PROGRESS';
export const SUCCESS = 'SUCCESS';
export const FAIL = 'FAIL';

const initialState = {
  requestState: null,
  error: null,
};

export default (state = initialState, action) => {
  const { id, error, type } = action;
  switch (type) {
    case AXIOS_REQUEST:
      return { ...state, requestState: [id, PROGRESS] };
    case AXIOS_REQUEST_FAIL:
      return { ...state, requestState: [id, FAIL], error };
    case AXIOS_REQUEST_SUCCESS:
      return { ...state, requestState: [id, SUCCESS] };
    case AXIOS_INITIAL:
      return { ...state, requestState: null, error: null };
    default:
      return state;
  }
};
