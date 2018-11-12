import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shallowEqual from 'recompose/shallowEqual';

import { getFieldValue } from '../../../../../core/utils';

const getStyles = props => ({
  customComponent: {
    ...props.style,
    marginTop: props.floatingLabelText ? 36 : 12,
    marginBottom: props.floatingLabelText ? -36 : -12,
    boxSizing: 'border-box',
    font: 'inherit',
    height: 'auto',
  },
  iconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  root: {
    position: 'relative', // because the shadow has position: 'absolute'
  },
  shadow: {
    resize: 'none',
    // Overflow also needed to here to remove the extra row
    // added to textareas in Firefox.
    overflowY: 'hidden',
    // Visibility needed to hide the extra text area on ipads
    // visibility: 'hidden',
    position: 'absolute',
    height: 'auto',
  },
});

class CustomFieldChild extends Component {
  static propTypes = {
    // *************************************************************************
    // тип value должен соответстовать обрабатываемему полем значению
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      ),
    ]),
    /**
     * Disables the text field if set to true.
     */
    // eslint-disable-next-line react/require-default-props
    // disabled: PropTypes.bool,
    fields: PropTypes.node.isRequired,
    /**
     * The id prop for the text field.
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное id
     */
    // eslint-disable-next-line react/require-default-props
    id: PropTypes.string,
    /** @ignore
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onBlur
     */
    form: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    // eslint-disable-next-line react/require-default-props
    onBlur: PropTypes.func,
    /**
     * Callback function that is fired when the textfield's value changes.
     *
     * @param {object} event Change event targeting the text field.
     * @param {string} newValue The new value of the text field.
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onChange
     */
    // eslint-disable-next-line react/require-default-props
    // onChange: PropTypes.func,
    /** @ignore
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onFocus
     */
    // eslint-disable-next-line react/require-default-props
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when ихмегяемься высота Editor
     *
     * @param {number} height Change event targeting the text field.
     */
    onHeightChange: PropTypes.func.isRequired,
    /**
     * The style prop for input style.
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное style
     */
    // prop используется в функции getStyles поэтомуе eslint НЕ видит его использования
    // eslint-disable-next-line react/require-default-props, react/no-unused-prop-types
    style: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.syncHeight = this.syncHeight.bind(this);
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      const { store } = this.context;
      this.unsubscribe = store.subscribe(this.handleChange);
      window.addEventListener('resize', this.syncHeight);
      setTimeout(this.syncHeight, 250);
      // после первой корриктировки высоты повторно отрисовываем ...
      // ... содержимое компоненты, инача ранее скрытые места отображаются ...
      // ... в виде белых областей
      setTimeout(() => this.forceUpdate(), 350);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.syncHeight();
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('resize', this.syncHeight);
      this.unsubscribe();
    }
  }

  handleChange() {
    const { form: formName, name } = this.props;
    const { form, runtime } = this.context.store.getState();
    // предохраняемся на случай если form или form[formName] НЕ устанвлены
    const value =
      form && form[formName] && getFieldValue(form[formName].values, name);
    // проверяем переключалось ли отображение / скрытие внутри данного поля
    const showRandomToken = runtime[`show:${formName}:${name}`];

    if (value !== this.value || showRandomToken !== this.showRandomToken) {
      this.value = value;
      this.showRandomToken = showRandomToken;
      setTimeout(this.syncHeight, 200);
    }
  }

  syncHeight() {
    if (this.containerDiv) {
      const newHeight = this.containerDiv.scrollHeight;
      if (newHeight !== this.height) {
        this.height = newHeight;
        this.props.onHeightChange(newHeight);
      }
    }
  }

  handleKeyDown(event) {
    const { onFocus, onBlur } = this.props;
    switch (event.key) {
      case 'Escape':
        onBlur(this.value);
        break;
      case 'Enter':
        onFocus(event);
        break;
      default:
      // ничего не предпринимаем
    }
  }

  render() {
    const { fields, id, onBlur, onFocus, style, value } = this.props;
    const { muiTheme: { prepareStyles } } = this.context;

    const styles = getStyles(this.props);
    const rootStyles = { ...styles.root, ...style };
    if (!this.height) rootStyles.overflow = 'hidden';

    const customComponent = {
      ...styles.customComponent,
      ...styles.shadow,
      // прячем возможно возникающий scrollbar
      overflowX: 'hidden',
    };

    return (
      <div
        id={id} // чтобы e2e тест знал к чему обращаться
        role="textbox" // чтобы не вызывало ошибку использование tabIndex="0"
        tabIndex="0" // чтобы РАБОТАЛ onBlur в div
        style={prepareStyles(rootStyles)}
        // eslint без role выдает ошибку "no-static-element-interactions"
        onClick={() => onFocus(value)}
        onFocus={() => onFocus(value)}
        onBlur={() => onBlur(value)}
        onKeyDown={this.handleKeyDown}
      >
        <div
          ref={div => {
            this.containerDiv = div;
          }}
          style={prepareStyles(customComponent)}
        >
          {fields}
        </div>
      </div>
    );
  }
}

export default CustomFieldChild;
