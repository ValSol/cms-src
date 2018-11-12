import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import PicturesSelectField from '../picturesComponents/PicturesSelectField';
import validationMessages from '../validationMessages';

const handleBlur = (input, normalizeOnBlur) => {
  const { value, onBlur } = input;
  if (normalizeOnBlur) {
    onBlur(normalizeOnBlur(value));
  } else {
    onBlur(value);
  }
};

const handleChange = (input, value) => {
  // добавил этот хендлер - иначе redux-form использовал в качестве
  // нового значения вместо newValueObj ...
  // ... вот такую конструкцию { target: {value: newValueObj }}
  const { onChange } = input;
  onChange(value);
};

const ReduxPicturesSelectField = (props, context) => {
  // только для полей оставил получение intl из контекста
  // во всех остальных компонентах передается через props
  // чтобы небыло затыков с перерисовкой при изменении локали
  const { formatMessage } = context.intl;

  const {
    input,
    label,
    normalizeOnBlur,
    // eslint-disable-next-line no-unused-vars
    meta,
    meta: { error, touched },
    ...custom
  } = props;

  const errorText =
    touched && error ? formatMessage(validationMessages[error]) : '';
  return (
    <PicturesSelectField
      hintText=""
      floatingLabelText={label}
      errorText={errorText}
      {...input}
      onBlur={() => handleBlur(input, normalizeOnBlur)}
      onChange={(event, value) => handleChange(input, value)}
      {...custom}
    />
  );
};

ReduxPicturesSelectField.propTypes = {
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.string]),
  ).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.array,
      PropTypes.string,
    ]),
  ).isRequired,
  normalizeOnBlur: PropTypes.func, // eslint-disable-line react/require-default-props
};

ReduxPicturesSelectField.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default ReduxPicturesSelectField;
