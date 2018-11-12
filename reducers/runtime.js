import { SET_RUNTIME_VARIABLE } from '../constants';

export default function runtime(state = {}, action) {
  switch (action.type) {
    case SET_RUNTIME_VARIABLE:
      // ************************************************
      // добавил чтобы лишний раз не переустанавливать стор
      if (state[[action.payload.name]] === action.payload.value) {
        return state;
      }
      // ************************************************
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
}
