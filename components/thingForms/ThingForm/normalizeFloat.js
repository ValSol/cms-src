import { isString } from '../../../core/utils';
// TODO - добавить возможность вводить ТОЧКУ (.) с клавиатуры

const normalizeFloat = value => {
  // value может быть или String или Number
  if (!value && isString(value)) return '';
  return parseFloat(value);
};
export default normalizeFloat;
