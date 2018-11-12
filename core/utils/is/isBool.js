const isBool = arg =>
  Object.prototype.toString.call(arg) === '[object Boolean]';

export default isBool;
