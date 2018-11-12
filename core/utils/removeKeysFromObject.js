import isArray from './is/isArray';
import isObject from './is/isObject';
// функция создает новую переменную рекурсивно НЕ включая указанные аттрибуты
// объектов если они присутствуют в иходной переменной
// obj - переменная из которого удаляются атрибуты объектов
// keyNames - имена атрибутов которых не будет в результируей переменной

const removeKeysFromObject = (variable, keyNames) => {
  if (isObject(variable)) {
    // если переменная - объект - в новый объект переносим только те аттрибуты
    // которые не входят в список запрещенных при этом ...
    // ... значения атрибутов рекурсивно преобразуются
    return Object.keys(variable).reduce((prev, key) => {
      if (!keyNames.includes(key)) {
        // eslint-disable-next-line no-param-reassign
        prev[key] = removeKeysFromObject(variable[key], keyNames);
      }
      return prev;
    }, {});
  } else if (isArray(variable)) {
    // если переменная - массив - в новый массив переносим элементы массив ...
    // ... при этом рекурсивно преобразуя эти элементы
    return variable.map(item => removeKeysFromObject(item, keyNames));
  }
  // если переменная НЕ объект или НЕ массив ...
  // ... возвращаям переменную без обработки
  return variable;
};

export default removeKeysFromObject;
