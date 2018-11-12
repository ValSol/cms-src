const isNumber = arg =>
  Object.prototype.toString.call(arg) === '[object Number]';

export default isNumber;
