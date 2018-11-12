import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import TextField from '@material-ui/core/TextField';

import validationMessages from '../validationMessages';

const handleBlur = (input, normalizeOnBlur) => {
  const { value, onBlur } = input;
  if (normalizeOnBlur) {
    onBlur(normalizeOnBlur(value));
  } else {
    onBlur(value);
  }
};

const ReduxTextField = (props, context) => {
  // только для полей оставил получение intl из контекста
  // во всех остальных компонентах передается через props
  // чтобы небыло затыков с перерисовкой при изменении локали
  const { formatMessage } = context.intl;

  const {
    input,
    label,
    normalizeOnBlur,
    validateUnTouched,
    // eslint-disable-next-line no-unused-vars
    meta,
    meta: { error, touched },
    ...custom
  } = props;

  const errorText =
    (touched || validateUnTouched) && error
      ? formatMessage(validationMessages[error])
      : null;

  return (
    <TextField
      error={!!errorText}
      placeholder=""
      label={label}
      helperText={errorText}
      {...input}
      margin="normal"
      onBlur={() => handleBlur(input, normalizeOnBlur)}
      {...custom}
    />
  );
};

ReduxTextField.propTypes = {
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.number, PropTypes.string]),
  ).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.number,
      PropTypes.string,
    ]),
  ).isRequired,
  normalizeOnBlur: PropTypes.func,
  // используем в slug, чтобы не корректный комбинация params + slug
  // даже если slug - untouched отображалась как ошибка
  validateUnTouched: PropTypes.bool,
};

ReduxTextField.defaultProps = {
  normalizeOnBlur: null,
  validateUnTouched: false,
};

ReduxTextField.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default ReduxTextField;
