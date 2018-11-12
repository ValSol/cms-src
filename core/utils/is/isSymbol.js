const isSymbol = arg =>
  Object.prototype.toString.call(arg) === '[object Symbol]';

export default isSymbol;
