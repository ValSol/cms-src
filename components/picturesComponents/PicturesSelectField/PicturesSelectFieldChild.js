import React, { Component } from 'react';
import PropTypes from 'prop-types';

import shallowEqual from 'recompose/shallowEqual';

import PicturesSelect from '../PicturesSelect';

const getStyles = props => ({
  picturesSelect: {
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
    // добавил overflowX в отличии от RichTextField
    overflowX: 'hidden', // иначе отображалась горизонтальная полоса прокрутки
    overflowY: 'hidden',
    // Visibility needed to hide the extra text area on ipads
    // visibility: 'hidden',
    position: 'absolute',
    height: 'auto',
  },
});

class PicturesSelectFieldChild extends Component {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    disabled: PropTypes.bool,
    /**
     * Disables the text field if set to true.
     */
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.arrayOf(PropTypes.object).isRequired,
    /**
     * Disables the text field if set to true.
     */
    // eslint-disable-next-line react/require-default-props
    // disabled: PropTypes.bool,
    /**
     * The _id prop for the text field.
     */
    _id: PropTypes.string.isRequired,
    /**
     * The id prop for the text field.
     */
    id: PropTypes.string.isRequired,
    /** @ignore
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onBlur
     */
    // eslint-disable-next-line react/require-default-props
    onChange: PropTypes.func.isRequired,
    /** @ignore
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onFocus
     */
    // eslint-disable-next-line react/require-default-props
    onBlur: PropTypes.func,
    /** @ignore
     * устанавливаем не обзязательно чтобы небыло предупреждение
     * при первом построении (до использовани cloneElement в TextField)
     * и уже TextField ОБЯЗАТЕЛЬНО утсановит нужное onFocus
     */
    // eslint-disable-next-line react/require-default-props
    onFocus: PropTypes.func,
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

  static contextTypes = { muiTheme: PropTypes.object.isRequired };

  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  handleKeyDown(event) {
    const { value, onBlur } = this.props;
    switch (event.key) {
      case 'Escape':
        onBlur(value);
        break;
      case 'Enter':
        this.focusInput.focus();
        break;
      default:
      // ничего не предпринимаем
    }
  }

  render() {
    const {
      disabled,
      _id,
      id,
      onBlur,
      onFocus,
      onChange,
      style,
      value,
    } = this.props;
    const { muiTheme: { prepareStyles } } = this.context;

    const styles = getStyles(this.props);
    const rootStyles = { ...styles.root, ...style };

    const picturesSelect = {
      ...styles.picturesSelect,
      ...styles.shadow,
    };

    return (
      <div
        style={prepareStyles(rootStyles)}
        // eslint без role выдает ошибку "no-static-element-interactions"
        role="presentation"
        onClick={() => this.focusInput.focus()}
        onKeyDown={this.handleKeyDown}
      >
        <div onBlur={() => onBlur(value)} style={prepareStyles(picturesSelect)}>
          <PicturesSelect
            disabled={disabled}
            onFocus={onFocus}
            getFocusInput={focusInput => {
              this.focusInput = focusInput;
            }}
            _id={_id}
            id={id}
            // eslint без role выдает ошибку "no-static-element-interactions"
            role="presentation"
            key={`pictures:${_id}`}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}

export default PicturesSelectFieldChild;
