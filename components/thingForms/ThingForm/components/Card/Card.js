import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { intlShape } from 'react-intl';

import IconButton from 'material-ui/IconButton';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import { grey300 } from 'material-ui/styles/colors';

import ItemTypes from './ItemTypes';

const cardSource = {
  beginDrag(props) {
    // arrayName пригодится чтобы "чужой список" не реагировал на Card
    const { id, index, arrayName } = props;
    return { id, index, arrayName };
  },
  // все необходимые изменения вносятся в процессе перетягивания
  // поэтому ничего не предпринимаем по завершению перетягивания
  //  endDrag(props, monitor, component) {
  // endDrag(props, monitor) {
  //   if (!monitor.didDrop()) {
  //     return;
  //   }
  //   // When dropped on a compatible target, do something
  //   props.dropCard();
  // },
};

const cardTarget = {
  hover(props, monitor, component) {
    const { index: dragIndex, arrayName } = monitor.getItem();
    const hoverIndex = props.index;

    // если не совпадают arrayName перетягиваемого Card и "места посадки"
    // значит текущий Card из ДРУГОГО списка и "место посадки" (target) ...
    // ... не должно никак меняться поэтому - выходим
    if (arrayName !== props.arrayName) {
      return;
    }

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
  },
};

class preCard extends Component {
  static propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    arrayName: PropTypes.string.isRequired, // используется в cardSource и cardSource функциях
    attributes: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    id: PropTypes.string.isRequired, // используется в cardSource функции
    isDragging: PropTypes.bool.isRequired,
    openDeletionAlertDialog: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.string,
    toggle: PropTypes.func.isRequired,
  };
  static defaultProps = {
    title: '',
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      titleHovered: false,
    };
  }

  handleMouseOver = () => {
    if (!this.state.hovered) this.setState({ hovered: true });
  };

  handleMouseOut = () => {
    if (this.state.hovered) this.setState({ hovered: false });
  };

  handleTitleMouseOver = () => {
    if (!this.state.titleHovered) this.setState({ titleHovered: true });
  };

  handleTitleMouseOut = () => {
    if (this.state.titleHovered) this.setState({ titleHovered: false });
  };

  render() {
    const {
      attributes: { messages, subDocumentName },
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      isDragging,
      openDeletionAlertDialog,
      submitting,
      title,
      toggle,
    } = this.props;
    const { intl: { formatMessage }, muiTheme: { palette } } = this.context;
    const opacity = isDragging ? 0 : 1;
    const iconHoverColor = palette.accent1Color;
    const keyColor = palette.accent3Color;
    const valueColor = palette.primary1Color;

    const handleStyle = {
      backgroundColor: valueColor,
      width: '16px',
      height: '16px',
      display: 'inline-block',
      marginLeft: '16px',
      cursor: 'move',
      position: 'absolute',
      top: '6px',
      left: '-32px',
    };
    const disabledHandleStyle = {
      ...handleStyle,
      backgroundColor: keyColor,
      cursor: null,
    };
    const h3style = {
      marginLeft: '32px',
      position: 'relative',
    };

    const containerStyle = {
      opacity,
      paddingTop: '16px',
      paddingBottom: '16px',
    };

    if (this.state.hovered) containerStyle.backgroundColor = grey300;

    const titleStyle = {
      cursor: 'pointer',
      marginRight: '32px',
    };

    if (this.state.titleHovered) {
      titleStyle.color = iconHoverColor;
    }

    return connectDragPreview(
      connectDropTarget(
        <div
          role="presentation"
          onMouseOver={this.handleMouseOver}
          onFocus={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onBlur={this.handleMouseOut}
          style={containerStyle}
        >
          <div style={h3style}>
            {submitting ? (
              <span style={disabledHandleStyle} />
            ) : (
              connectDragSource(<span style={handleStyle} />)
            )}
            <div
              style={{
                fontSize: '16px',
                marginLeft: '16px',
                position: 'relative',
                width: '100%',
              }}
            >
              <div
                onMouseOver={this.handleTitleMouseOver}
                onFocus={this.handleTitleMouseOver}
                onMouseOut={this.handleTitleMouseOut}
                onBlur={this.handleTitleMouseOut}
                style={titleStyle}
                role="presentation"
                onClick={toggle}
              >
                {title || formatMessage(messages[`New${subDocumentName}`])}
              </div>
              <IconButton
                onClick={openDeletionAlertDialog}
                tooltip={formatMessage(messages[`Remove${subDocumentName}`])}
                tooltipPosition="top-left"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '-12px',
                }}
              >
                <DeleteForeverIcon
                  hoverColor={iconHoverColor}
                  color={keyColor}
                />
              </IconButton>
            </div>
          </div>
        </div>,
      ),
    );
  }
}

// обертка внедряют (инжектят) в компоненту дополнительные пропсы:
// функции connectDragSource и connectDragPreview и булевое isDragging
// исходя из параметров объектов: ItemTypes.CARD, cardSource,
const Card = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(preCard);

// обертка внедряют (инжектят) в компоненту дополнительный пропс:
// функцию connectDropTarget
// исходя из параметров объектов: ItemTypes.CARD, cardTarget,
export default DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(Card);
