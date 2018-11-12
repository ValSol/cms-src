import isArray from '../is/isArray';
import isJSONString from '../is/isJSONString';
import isObject from '../is/isObject';
import isString from '../is/isString';
import isNumber from '../is/isNumber';

// функция из входящих параметров формирует graphql запрос
// используется ДЛЯ ТЕСТИРОВАНИЯ graphql запрос без задействования Apollo

// вспомогательная функция чтобы отображать массив
export const arrayToString = (array, onlyFields, objectToStringFunc) =>
  `[${array.map(item => {
    if (isString(item)) return `"${item}"`;
    if (isNumber(item)) return `${item}`;
    if (isArray(item)) {
      return `${arrayToString(item, onlyFields, objectToStringFunc)}`;
    }
    return objectToStringFunc(item, onlyFields, true);
  })}]`;

// функция преобразут объект в его текстовое представление
export const objectToString = (args, onlyFields, inCurlyBraces) => {
  const result = Object.keys(args)
    .map(key => {
      if (isObject(args[key])) {
        return `${key}${onlyFields ? '' : ':'}${objectToString(
          args[key],
          onlyFields,
          true,
        )}`;
      } else if (isArray(args[key])) {
        return `${key}${onlyFields ? '' : ':'}${arrayToString(
          args[key],
          onlyFields,
          objectToString,
        )}`;
      }

      if (onlyFields) return key;

      if (isJSONString(args[key])) {
        return `${key}:"${args[key].split('"').join('\\"')}"`;
      }
      // переводы строки заменяем на \n
      // и обратные косые чтобы они правильно воспинимались
      if (isString(args[key])) {
        return `${key}:"${args[key]
          .split('\\')
          .join('\\\\')
          .split('\n')
          .join('\\n')}"`;
      }

      return `${key}:${args[key]}`;
    })
    .join(',');
  // если не было никаких аргументов возвращается пустая строка
  return (
    result && `${inCurlyBraces ? '{' : ''}${result}${inCurlyBraces ? '}' : ''}`
  );
};

// --------------------------------------

const objectsToQueryBody = (name, args, fields, mutation) => {
  let inputArgs = objectToString(args); // если входных аргументов нет ...
  inputArgs = inputArgs && `(${inputArgs})`; // ... скобки не используются
  return JSON.stringify({
    query: `${mutation ? 'mutation' : ''}{${name}${inputArgs}${
      fields ? `{${objectToString(fields, true)}}` : ''
    }}`,
  });
};
// --------------------------------------

export default objectsToQueryBody;
