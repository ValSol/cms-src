import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import TextField from 'material-ui/TextField';

import validationMessages from '../validationMessages';

const handleBlur = (input, normalizeOnBlur) => {
  const { value, onBlur } = input;
  if (normalizeOnBlur) {
    onBlur(normalizeOnBlur(value));
  } else {
    onBlur(value);
  }
};

// компонента НЕ ИСПОЛЬЗУЕТСЯ, оставлена как пример на всякий случай

class ReduxTextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      touched: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { error, touched } = nextProps.meta;
    if (
      error !== this.props.meta.error ||
      touched !== this.props.meta.touched
    ) {
      // мгновенная отработка изменений в отображении ошибки препятствуент
      // переходу при нажатии на не submit кнопку
      // поэтому отображение ошибки осуществляем с задержкой
      // задержка в 100 - выбрана методом тыка...
      // меньше - бывает нажатие кнопки не отрабатывается
      this.timeout = setTimeout(() => this.setState({ error, touched }), 125);
    }
  }

  componentWillUnmount() {
    // до размонтирования нужно отменить this.setState, выполняемый с timeout'ом
    clearTimeout(this.timeout);
  }

  render() {
    // только для полей оставил получение intl из контекста
    // во всех остальных компонентах передается через props
    // чтобы небыло затыков с перерисовкой при изменении локали
    const { formatMessage } = this.context.intl;

    const {
      input,
      label,
      normalizeOnBlur,
      validateUnTouched,
      // eslint-disable-next-line no-unused-vars
      meta,
      ...custom
    } = this.props;

    const { touched, error } = this.state;

    const errorText =
      (touched || validateUnTouched) && error
        ? formatMessage(validationMessages[error])
        : '';

    return (
      <TextField
        hintText=""
        floatingLabelText={label}
        errorText={errorText}
        {...input}
        onBlur={() => handleBlur(input, normalizeOnBlur)}
        {...custom}
      />
    );
  }
}

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
