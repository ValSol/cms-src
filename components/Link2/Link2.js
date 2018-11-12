import React from 'react';
import PropTypes from 'prop-types';

import { isLeftClickEvent, isModifiedEvent } from '../../core/utils';
import history from '../../history';
import showAlarmDialog from '../Layout2/showAlarmDialog';

class Link2 extends React.Component {
  static propTypes = {
    children: PropTypes.node, // eslint-disable-line react/require-default-props
    color: PropTypes.string,
    onClick: PropTypes.func, // eslint-disable-line react/require-default-props
    href: PropTypes.string.isRequired,
  };

  static defaultProps = {
    color: null,
    onClick: null,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }

  handleClick = event => {
    const { onClick, href } = this.props;
    if (onClick) {
      onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    if (href.slice(0, 7) === 'http://' || href.slice(0, 8) === 'https://') {
      return;
    }

    event.preventDefault();
    // если предупреждение об уходе со страницы (alarmDialog) ...
    // ... отображать не надо просто осуществляе переход ...
    // ... в противном случае функция showAlarmDialog отобразит предупреждение
    if (!showAlarmDialog(this.context, href)) history.push(href);
  };

  handleMouseOver = () => {
    if (!this.state.hovered) this.setState({ hovered: true });
  };

  handleMouseOut = () => {
    if (this.state.hovered) this.setState({ hovered: false });
  };

  render() {
    const { children, color, href, ...props } = this.props;
    // устанавливаем текущий цвет ссылки
    const currentColor = !this.state.hovered
      ? color || 'black'
      : this.context.muiTheme.palette.accent1Color;

    return (
      <a
        style={{ color: currentColor, textDecoration: 'none' }}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        {...props}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onFocus={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onBlur={this.handleMouseOut}
      >
        {children}
      </a>
    );
  }
}

export default Link2;
