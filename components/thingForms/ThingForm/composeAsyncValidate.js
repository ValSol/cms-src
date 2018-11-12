/* eslint-disable no-underscore-dangle, no-throw-literal */
// ВНИМАНИЕ! здесь используем нативный Promise а не 'bluebird';
// чтобы не задалбывала предупреждением: Promise rejected with non-error warning

import {
  composeThingGqlQueriesByCompoundIndexes,
  composeThingGqlVariablesForValidationByCompoundIndexes,
} from '../../../core/utils';

const composeAsyncValidate = thingConfig => async (
  values,
  dispatch,
  { client },
  blurredFieldName,
) => {
  const { thingName } = thingConfig;

  // получаем и фильтруем notParamFields и переменные для запросов
  // выполняемых при валидации
  const {
    notParamFieldNamesInUse,
    variablesSets,
  } = composeThingGqlVariablesForValidationByCompoundIndexes(
    thingConfig,
    values,
    blurredFieldName,
  );

  // получаем и фильтруем запросы необходимые для валидации
  const queries = composeThingGqlQueriesByCompoundIndexes(
    thingConfig,
    values,
    blurredFieldName,
  );

  // заполянем массив запросами сответствующими compoundIndexFieldSets
  // чтобы выполнить их паралельно
  const promises = queries.reduce((prev, query, i) => {
    variablesSets[i].forEach(variables =>
      prev.push(client.query({ query, variables })),
    );
    return prev;
  }, []);

  // выполняем валидирующие запросы параллельно. Из массива, ...
  // ... а не сформировав общий запрос чтобы Apollo кешировал ...
  // ... каждый отдельный запрос и использовал кеш для каждого отдельного запроса
  let resultOfQueries;
  try {
    resultOfQueries = await Promise.all(promises);
  } catch (err) {
    // если при выполнении запросов случились какие-то ошибки - выходим ...
    // ... возбуждая ошибку
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ _error: 'InternetConnectionError' });
  }

  const result = {};
  resultOfQueries.forEach(({ data, errors }, i) => {
    if (
      data &&
      data[thingName.toLowerCase()] &&
      (!values._id || values._id !== data[thingName.toLowerCase()]._id)
    ) {
      const notParamFieldName = notParamFieldNamesInUse[i];
      if (values[notParamFieldName]) {
        result[notParamFieldName] = `${notParamFieldName}AlreadyTaken`;
      } else {
        result[
          notParamFieldName
        ] = `${notParamFieldName}AsEmptyFieldAlreadyTaken`;
      }
    }
    if (errors) result._error = 'DataProcessingFailure';
  });

  // возбуждаем ошибки соответствующие result
  if (Object.keys(result).length) return Promise.reject(result);

  // если массив результатов пустой, т.е. или был пустым массив promises ...
  // ... или никаких ошибок валидации не обнаружено ...
  // ... выходим без возбуждения ошибки
  return Promise.resolve();
};
export default composeAsyncValidate;
