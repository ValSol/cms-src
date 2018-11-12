const isFunction = arg =>
  Object.prototype.toString.call(arg) === '[object Function]';

export default isFunction;
