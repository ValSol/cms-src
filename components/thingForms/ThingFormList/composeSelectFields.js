import React from 'react';
// функция формируем выпадающие списки для отфильтровывания
// данных в общем списке публикаций

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import queryString from 'query-string';

import { paramsMessages } from '../../../appConfig/messages';
import {
  getParamsValues,
  goToAnotherQuery,
  filtersFromQuery,
} from '../../../core/utils';
import history from '../../../history';

const style = {
  extraSmallSelectField: {
    marginRight: '24px',
  },
  selectField: {
    marginRight: '24px',
    width: '232px',
  },
};

// обработчик выбора нового значения в выпадающем списке
export const handleChange = (paramName, event, index, value) => {
  const query = queryString.parse(history.location.search);
  // убираем прошлое значение фильтра по данному paramName
  delete query[`filteredby${paramName}`];
  // и устанавливаем новое значение фильтра по данному paramName
  const newQuery =
    value === `${paramName}FilterAll`
      ? query
      : { ...query, [`filteredby${paramName}`]: value };
  goToAnotherQuery(newQuery);
};

const composeSelectFields = (
  params,
  items,
  propsFromComponent,
  contextFromComponent,
) => {
  const {
    thingConfig,
    thingConfig: { thingName, paramFields },
    query,
    mediaType,
  } = propsFromComponent;
  const { intl: { formatMessage } } = contextFromComponent;

  // определяем фильтры исходя из query и params
  // thingParams - структура таже что и params, только для подмножества
  // относящегося только к данной thing
  const thingParams = paramFields.reduce(
    (prev, { name }) => ({ ...prev, [name]: params[name] }),
    {},
  );
  // например получаем: filters = { subject: 'patent', section: 'info' }
  const filters = filtersFromQuery(query, thingParams);
  // структура та же что и в thingParams, но содержат только значения
  // по которым можно хоть что-то отфильтровать исходя из filters
  const paramsValues = getParamsValues(
    thingConfig,
    items,
    thingParams,
    filters,
  );

  // к значениям по каждому фильтру добавляем FilterAll чтобы выдавать все доступные
  Object.keys(paramsValues).forEach(paramName =>
    paramsValues[paramName].unshift(`${paramName}FilterAll`),
  );

  const selectFields = paramFields.map(({ name: paramName }) => (
    <SelectField
      key={paramName}
      id={`${paramName}FilterFor${thingName}`}
      floatingLabelText={formatMessage(
        paramsMessages[`${paramName}FilterLabel`],
      )}
      onChange={(event, index, value) =>
        handleChange(paramName, event, index, value)
      }
      style={
        mediaType === 'extraSmall' || mediaType === 'small'
          ? style.extraSmallSelectField
          : style.selectField
      }
      // проверяем что параметр правильный чтобы не оказывалось пустого значения
      // в выпдающем списке, (должно быть или правильное значение или FilterAll)
      value={
        (thingParams[paramName].includes(query[`filteredby${paramName}`]) &&
          query[`filteredby${paramName}`]) ||
        `${paramName}FilterAll`
      }
    >
      {paramsValues[paramName].map(paramValue => (
        <MenuItem
          key={paramValue}
          value={paramValue}
          primaryText={formatMessage(paramsMessages[paramValue])}
        />
      ))}
    </SelectField>
  ));

  return selectFields;
};

export default composeSelectFields;
