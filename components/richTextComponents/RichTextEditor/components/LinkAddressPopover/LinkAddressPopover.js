import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover/Popover';
import DoneIcon from 'material-ui/svg-icons/action/done';
import IconButton from 'material-ui/IconButton';

import richTextMessages from '../../../richTextMessages';

class LinkAddressPopover extends Component {
  static propTypes = {
    anchorEl: PropTypes.objectOf(PropTypes.object),
    onRequestClose: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
    open: PropTypes.bool,
    value: PropTypes.string,
  };
  static defaultProps = {
    anchorEl: null,
    open: false,
    value: '',
  };
  static contextTypes = {
    intl: intlShape.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange = event => {
    this.setState({
      value: event.target.value.trim(),
    });
  };

  handleKeyDown(event) {
    const { onEnter, onRequestClose } = this.props;
    switch (event.key) {
      case 'Escape':
        onRequestClose();
        break;
      case 'Enter':
        event.preventDefault(); // иначе будет удален выделенный текст
        onEnter(this.state.value);
        break;
      default:
      // ничего не предпринимаем
    }
  }

  render() {
    const { anchorEl, onEnter, onRequestClose, open } = this.props;
    const { intl: { formatMessage } } = this.context;
    return (
      <Popover
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
        onRequestClose={onRequestClose}
      >
        {/* без div с marginLeft отображалась полоса прокрутки */}
        <div style={{ marginLeft: '16px' }}>
          <TextField
            hintText={formatMessage(richTextMessages.linkAddress)}
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            spellCheck="false"
          />
          <IconButton onClick={() => onEnter(this.state.value)}>
            <DoneIcon />
          </IconButton>
        </div>
      </Popover>
    );
  }
}

export default LinkAddressPopover;
