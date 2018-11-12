import isArray from './isArray';
import isObject from './isObject';

const isDraftRaw = arg => {
  // проверяем что является объеком
  if (!isObject(arg)) return false;
  // проверяем что объект содержит обязательные ключи
  if (!arg.entityMap) return false;
  if (!arg.blocks) return false;
  // проверяем что под ключами хранятся данные в определенном формате
  if (isArray(arg.blocks) && isObject(arg.entityMap)) return true;
  // в остальных случаях неправильный формат
  return false;
};

export default isDraftRaw;
