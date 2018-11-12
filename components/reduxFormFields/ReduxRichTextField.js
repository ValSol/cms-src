import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import RichTextField from '../richTextComponents/RichTextField';
import validationMessages from '../validationMessages';

const handleBlur = (input, normalizeOnBlur) => {
  const { value, onBlur } = input;
  if (normalizeOnBlur) {
    onBlur(normalizeOnBlur(value));
  } else {
    onBlur(value);
  }
};

const handleChange = (input, value, meta) => {
  // добавил этот хендлер - 1) иначе redux-form использовал в качестве
  // нового значения вместо newValueObj ...
  // ... вот такую конструкцию { target: {value: newValueObj }}
  const { onChange } = input;
  // 2) НЕ вызываем onChange для изначально пустого нередарктированного поля
  // чтобы при первом клике на поле в пустой форме - поле сразу не краснело
  // сообщением об ошибке
  const { initial, touched } = meta;
  if (value || touched || initial) onChange(value);
};

const ReduxRichTextField = (props, context) => {
  // только для полей оставил получение intl из контекста
  // во всех остальных компонентах передается через props
  // чтобы небыло затыков с перерисовкой при изменении локали
  const { formatMessage } = context.intl;

  const {
    input,
    label,
    normalizeOnBlur,
    meta,
    meta: { touched, error },
    ...custom
  } = props;

  const errorText =
    touched && error ? formatMessage(validationMessages[error]) : '';
  return (
    <RichTextField
      error={!!errorText}
      label={label}
      helperText={errorText}
      {...input}
      onBlur={() => handleBlur(input, normalizeOnBlur)}
      onDrop={event => event.preventDefault()} // иначе не то value подставляется
      onChange={({ target: { value } }) => handleChange(input, value, meta)}
      {...custom}
    />
  );
};

ReduxRichTextField.propTypes = {
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),
  ).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  normalizeOnBlur: PropTypes.func, // eslint-disable-line react/require-default-props
};

ReduxRichTextField.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default ReduxRichTextField;
