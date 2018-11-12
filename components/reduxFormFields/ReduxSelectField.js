import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import validationMessages from '../validationMessages';
import { paramsMessages } from '../../appConfig/messages';

const handleChange = (value, input) => {
  // инициируем валидацию при каждом выборе нового значения селектом
  if (value !== input.value) {
    input.onChange(value);
    input.onBlur(value); // инициирует валидацию
  }
};

const ReduxSelectField = (
  {
    input,
    input: { value },
    label,
    meta,
    meta: { touched, error },
    children,
    fullWidth,
    disabled,
    multiple,
    required,
    // eslint-disable-next-line no-unused-vars
    ...custom
  },
  { intl: { formatMessage } },
) => {
  const errorText =
    touched && error ? formatMessage(validationMessages[error]) : null;
  return (
    // используем onBlur={(event, index, value) => input.onBlur(value)} ...
    // ... чтобы небыло ошибки обнуления поля оnBlur если поле disabled
    <FormControl
      error={touched && error}
      disabled={disabled}
      fullWidth={fullWidth}
      margin="normal"
      required={required}
      value={value}
    >
      <InputLabel htmlFor="select-multiple">{label}</InputLabel>
      <Select
        {...input}
        onChange={({ target: { value: value2 } }) =>
          handleChange(value2, input)
        }
        onBlur={(event, index, value2) => {
          // добавил выход без обработки если blur вызван нажатием кнопки escape
          // иначе по нажатию escape внутри поля сбрасывались все ошибки ...
          // ... завязанные на selectField
          if (index === undefined && value === undefined) return;
          input.onBlur(value2);
        }}
        multiple={multiple}
        renderValue={selected =>
          multiple
            ? selected
                .map(item => formatMessage(paramsMessages[item]))
                .join(', ')
            : formatMessage(paramsMessages[selected])
        }
        {...custom}
      >
        {children}
      </Select>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

ReduxSelectField.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  disabled: PropTypes.bool.isRequired,
  input: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.array]),
  ),
  fullWidth: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
      PropTypes.string,
      PropTypes.array,
    ]),
  ),
  multiple: PropTypes.bool.isRequired,
  required: PropTypes.bool.isRequired,
};

ReduxSelectField.defaultProps = {
  input: {},
  meta: {},
};

ReduxSelectField.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default ReduxSelectField;
