const isString = arg =>
  Object.prototype.toString.call(arg) === '[object String]';

export default isString;
