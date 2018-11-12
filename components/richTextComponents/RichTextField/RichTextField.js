import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import RichTextFieldChild from './RichTextFieldChild';

// ВНИМАНИЕ в форме потребуется обязательное НАЛИЧИЕ поля pictures
// для хранение данных об используемых в RichTextField картинках

const RichTextField = props => {
  const {
    change, // используем в RichTextFieldChild чтобы менять поле pictures
    error,
    helperText,
    id,
    fullPagePath,
    label,
    name,
    onChange,
    pictures,
    value,
  } = props;
  const inputProps = { fullPagePath, change, pictures, value };
  return (
    <FormControl error={error} fullWidth margin="normal">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
        inputComponent={RichTextFieldChild}
        inputProps={inputProps}
        // знать свое имя чтобы вносить изменения в поле pictures
        // при изменения использование / не использование какой-то картинки
        name={name}
        onChange={onChange}
        // используем заглушку 'stub' вместо нормального значения иначе
        // компонента Input выдает предупреждение о несоответствии типа
        value={value && 'stub'}
      />
      <FormHelperText id={`${id}-FormHelperText`}>{helperText}</FormHelperText>
    </FormControl>
  );
};

RichTextField.propTypes = {
  error: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  fullPagePath: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  pictures: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ),
  ]),
};

RichTextField.defaultProps = {
  fullPagePath: '',
  pictures: [],
  value: '',
};
export default RichTextField;
