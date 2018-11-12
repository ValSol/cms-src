import isObject from '../is/isObject';

// формирует gql-запрос в виде строки для дальнейшей обработки
// методом gql пакета 'graphql-tag'
// name - имя запроса или мутации
// args - аргументы запроса или мутации в виде массива объектов
// argsForDirectives - аргументы которые используются НЕ в запросее или мутации ...
// ... а в директивах skip или include
// типа { name: 'subject', type: 'Stirng!'}
// fields - объект задающий иерархию возвращаемых полей
// mutation - логический (true/false) если true - формируется мутация, иначе: запрос

// вспомогательная функция формирующая иерархию отображаемых полей
const composeFields = (queryFields, resultArray = [], shift = 2) => {
  Object.keys(queryFields).reduce((prev, fieldName) => {
    if (queryFields[fieldName] === null) {
      prev.push(`${'  '.repeat(shift)}${fieldName}`);
    } else {
      // поле может быть ТОЛЬКО объектом
      if (!isObject(queryFields[fieldName])) {
        throw new TypeError(
          `Incorrect type of field 'fieldName' is '${typeof queryFields[
            fieldName
          ]}' must be 'object'`,
        );
      }
      prev.push(`${'  '.repeat(shift)}${fieldName} {`);
      composeFields(queryFields[fieldName], prev, shift + 1);
      prev.push(`${'  '.repeat(shift)}}`);
    }
    return prev;
  }, resultArray);
  return resultArray;
};

const composeGql = (
  queryName,
  queryArgs,
  argsForDirectives,
  queryFields,
  mutation,
) => {
  const argsString = [...queryArgs, ...argsForDirectives]
    .map(({ name, type, value }) => (value ? '' : `$${name}: ${type}`))
    .filter(Boolean) // убираем пустые строки
    .join(', ');
  const argsStringWhithParentheses = argsString ? `(${argsString})` : '';
  const argsString2 = queryArgs
    .map(
      ({ name, value }) => (value ? `${name}: ${value}` : `${name}: $${name}`),
    )
    .join(', ');
  const argsString2WhithParentheses = argsString2 ? `(${argsString2})` : '';
  const fields = composeFields(queryFields).join('\n');
  return `
${mutation ? 'mutation' : 'query'} ${queryName}${argsStringWhithParentheses} {
  ${queryName}${argsString2WhithParentheses} {
${fields}
  }
}
`;
};

export default composeGql;
