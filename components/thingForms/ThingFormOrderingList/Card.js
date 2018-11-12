import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { intlShape } from 'react-intl';

import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import TocIcon from 'material-ui/svg-icons/action/toc';
import { grey300 } from 'material-ui/styles/colors';

import queryString from 'query-string';

import { composeTextWithParams } from '../../../core/utils';
import Link2 from '../../Link2';
import { paramsMessages } from '../../../appConfig/messages';
import ItemTypes from './ItemTypes';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },

  //  endDrag(props, monitor, component) {
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    // When dropped on a compatible target, do something
    props.dropCard();
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

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
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    backLinks: PropTypes.arrayOf(PropTypes.object).isRequired,
    backLinksFormPath: PropTypes.string.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    filters: PropTypes.objectOf(PropTypes.string).isRequired,
    formPath: PropTypes.string.isRequired,
    deleteFormPath: PropTypes.string.isRequired,
    isDragging: PropTypes.bool.isRequired,
    query: PropTypes.objectOf(PropTypes.string).isRequired,
    submitting: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
    // методы используем чтобы подсвечивать строку
    // на которую наведен указатель мышки
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    if (!this.state.hovered) this.setState({ hovered: true });
  }

  handleMouseOut() {
    if (this.state.hovered) this.setState({ hovered: false });
  }

  render() {
    const {
      backLinks,
      backLinksFormPath,
      thingConfig: { paramFields },
      connectDragPreview,
      connectDragSource,
      connectDropTarget,
      deleteFormPath,
      formPath,
      id,
      isDragging,
      query,
      filters,
      submitting,
      title,
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
    const translator = msg => formatMessage(paramsMessages[msg]);

    const style = { opacity, paddingTop: '16px', paddingBottom: '16px' };
    if (this.state.hovered) style.backgroundColor = grey300;
    // формируем строку с параметрами для адреса
    const search = Object.keys(query).length
      ? `?${queryString.stringify(query)}`
      : '';

    const paramNamesObject = paramFields.reduce((prev, { name }) => {
      // eslint-disable-next-line no-param-reassign
      prev[name] = [translator, translator];
      return prev;
    }, {});

    const rightLink = backLinks.length ? (
      <Link2
        style={{ float: 'right', marginRight: '16px' }}
        href={`${backLinksFormPath}/${id}${search}`}
      >
        <TocIcon hoverColor={iconHoverColor} color={keyColor} />
      </Link2>
    ) : (
      <Link2
        style={{ float: 'right', marginRight: '16px' }}
        href={`${deleteFormPath}/${id}${search}`}
      >
        <DeleteForeverIcon hoverColor={iconHoverColor} color={keyColor} />
      </Link2>
    );
    return connectDragPreview(
      connectDropTarget(
        <div
          onMouseOver={this.handleMouseOver}
          onFocus={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onBlur={this.handleMouseOut}
          style={style}
        >
          <div style={h3style}>
            {submitting ? (
              <span style={disabledHandleStyle} />
            ) : (
              connectDragSource(<span style={handleStyle} />)
            )}
            <div style={{ lineHeight: '16px', marginLeft: '16px' }}>
              <span style={{ fontSize: '16px' }}>
                <Link2 href={`${formPath}/${id}${search}`}>{title}</Link2>
                {rightLink}
              </span>
              {composeTextWithParams(
                filters,
                paramNamesObject,
                keyColor,
                valueColor,
                formPath,
                query,
              )}
            </div>
          </div>
        </div>,
      ),
    );
  }
}

const Card = DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(preCard);

export default DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(Card);
