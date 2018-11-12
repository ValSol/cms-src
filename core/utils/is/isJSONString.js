import isString from './isString';

const isJSONString = arg => {
  if (!isString(arg)) return false;
  try {
    JSON.parse(arg);
  } catch (e) {
    return false;
  }
  return true;
};

export default isJSONString;
