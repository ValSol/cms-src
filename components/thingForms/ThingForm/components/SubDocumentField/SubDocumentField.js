import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import shallowEqual from 'recompose/shallowEqual';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';

import { getFieldValue, isArray, isObject } from '../../../../../core/utils';
import SubDocumentFieldChild from './SubDocumentFieldChild';

// шаблон для создания кастомного поля material-ui

class SubDocumentField extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    floatingLabelText: PropTypes.node,
    form: PropTypes.string.isRequired,
    mediaType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // onChange: PropTypes.func.isRequired,
    // *************************************************************************
    // тип value должен соответстовать обрабатываемему полем значению
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      ),
    ]),
  };

  static defaultProps = {
    floatingLabelText: null,
    value: '',
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleHeightChange = this.handleHeightChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  handleHeightChange = height => {
    // метод получающий высоту и меняющий высоту содержимого
    let newHeight = height + 24;
    if (this.props.floatingLabelText) {
      newHeight += 24;
    }
    // eslint-disable-next-line react/no-find-dom-node
    ReactDOM.findDOMNode(this).style.height = `${newHeight}px`;
  };

  render() {
    const { mediaType, ...rest } = this.props;

    const { floatingLabelText, form: formName, name } = this.props;
    const { form } = this.context.store.getState();
    // предохраняемся на случай если form или form[formName] НЕ устанвлены
    const value =
      form && form[formName] && getFieldValue(form[formName].values, name);
    let newHeight = 80;
    if (isArray(value)) {
      // вычисляем высоту компоненты содержащей массив заголовков subDocument'ов
      newHeight = (value.length * 7 + 7) * 8;
    } else if (isObject(value)) {
      // вычисляем высоту отдельно компоненты ...
      // ... (вычиселния не тоные цифры взяты "с потолка")
      newHeight = (Object.keys(value).length + 5) * 32;
    }
    if (floatingLabelText) {
      newHeight += 24;
    }
    const textField = (
      <TextField
        {...rest}
        floatingLabelFixed
        multiLine
        style={{ height: `${newHeight}px` }}
        // подчеркивание не отображаем (без него красивее)
        underlineStyle={{ display: 'none' }}
      >
        <SubDocumentFieldChild
          {...rest}
          // Callback который устанавливает высоту текущего (рутового) контейнера
          onHeightChange={this.handleHeightChange}
          fields={this.props.children}
        />
      </TextField>
    );
    // !!! TODO margin & padding устанавливать в appConfig
    return mediaType === 'extraSmall' ? (
      textField
    ) : (
      <Paper
        style={{
          marginBottom: '8px',
          marginTop: '8px',
          paddingLeft: '8px',
          paddingRight: '8px',
        }}
        zDepth={2}
      >
        {textField}
      </Paper>
    );
  }
}

export default SubDocumentField;
