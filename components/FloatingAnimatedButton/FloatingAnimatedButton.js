import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import { isLeftClickEvent, isModifiedEvent } from '../../core/utils';

class FloatingAminatedButton extends Component {
  static propTypes = {
    // объявляется как НЕобязательный параметр так как передается
    //  в компоненту через React.cloneElement, т.е. перевончально компонента
    // создается без установленного prop onPressButton
    actionRouteName: PropTypes.string,
    actionSuffix: PropTypes.string,
    Icon: PropTypes.func.isRequired,
    onPressHideButton: PropTypes.bool,
    onPressButton: PropTypes.func.isRequired,
    secondaryColor: PropTypes.bool,
  };

  static defaultProps = {
    actionRouteName: '',
    actionSuffix: '',
    onPressHideButton: false,
    secondaryColor: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: false,
    };
    this.handleFloatingActionButtonClick = this.handleFloatingActionButtonClick.bind(
      this,
    );
  }

  handleFloatingActionButtonClick(event) {
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    event.stopPropagation();
    const { actionRouteName, actionSuffix } = this.props;
    this.setState(
      { buttonPressed: true },
      // вызываем фукнцию отрабатывающую анимацию и,
      // затем, переход на другую страницу по сформированному адресу
      this.props.onPressButton(actionRouteName, actionSuffix),
    );
  }

  render() {
    const { buttonPressed } = this.state;
    const {
      actionRouteName,
      actionSuffix,
      Icon,
      onPressButton,
      onPressHideButton,
      secondaryColor,
      ...rest
    } = this.props;
    return !buttonPressed || !onPressHideButton ? (
      <FloatingActionButton
        {...rest}
        onClick={this.handleFloatingActionButtonClick}
        secondary={secondaryColor}
      >
        {<Icon />}
      </FloatingActionButton>
    ) : (
      <div />
    );
  }
}
export default FloatingAminatedButton;
