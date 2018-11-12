import React, { Component } from 'react';
import PropTypes from 'prop-types';

import shallowEqual from 'recompose/shallowEqual';
import TextField from 'material-ui/TextField';

import { picturesSelectCellHeight as cellHeight } from '../../../appConfig';
import PicturesSelectFieldChild from './PicturesSelectFieldChild';
import colsCount from '../colsCount';

class PicturesSelectField extends Component {
  static propTypes = {
    floatingLabelText: PropTypes.node,
    _id: PropTypes.string, // код thing которой принадлежат картинки
    id: PropTypes.string.isRequired, // id кнопки получения картинки
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    floatingLabelText: null,
    _id: '',
    value: [],
  };

  static contextTypes = { store: PropTypes.object.isRequired };

  constructor(props, context) {
    super(props);

    // чтобы отсеживать изменение mediaType при resize экрана
    // заносим его в state
    const { browser: { mediaType } } = context.store.getState();
    this.state = { mediaType };

    this.handleChange = this.handleChange.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  componentDidMount() {
    // устанавливаем высоту компоненты
    if (process.env.BROWSER) {
      window.addEventListener('resize', this.resizeHandler);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  handleChange = value => {
    const { onChange } = this.props;
    // для последующей интеграции с redux-form перемещаем value на 2-е месть
    // т.к. на 1-м должна быть переменная event (которую НЕ используем)
    onChange(null, value);
  };

  resizeHandler() {
    const { browser: { mediaType } } = this.context.store.getState();
    this.setState({ mediaType });
  }

  render() {
    const {
      _id, // изымаем _id оставляя rest
      ...rest
    } = this.props;
    const { id, floatingLabelText, value } = this.props;

    // вычисляем высоту компоненты
    const cols = colsCount(this.state.mediaType);
    const height = Math.ceil((value.length + 1) / cols) * (cellHeight + 4);
    let newHeight = height + 24;
    if (floatingLabelText) {
      newHeight += 24;
    }

    return (
      <TextField {...rest} multiLine fullWidth style={{ height: newHeight }}>
        <PicturesSelectFieldChild
          floatingLabelText={floatingLabelText}
          // _id используется для определения для какой публикации (с каким _id)
          // картинка находится в одном из состояний загрузки (PROGRESS, SUCCESS или FAIL)
          _id={_id}
          id={id}
          value={value}
          onChange={this.handleChange}
        />
      </TextField>
    );
  }
}

export default PicturesSelectField;
