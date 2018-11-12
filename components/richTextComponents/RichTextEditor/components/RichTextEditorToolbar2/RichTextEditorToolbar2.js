import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import InserPhotoIcon from 'material-ui/svg-icons/editor/insert-photo';
import SaveIcon from 'material-ui/svg-icons/content/save';
import FormatBoldIcon from 'material-ui/svg-icons/editor/format-bold';
import DragHandleIcon from 'material-ui/svg-icons/editor/drag-handle';
import FormatListBulletedIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import FormatListNumberedIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import TitleIcon from 'material-ui/svg-icons/editor/title';
import FormatItalicIcon from 'material-ui/svg-icons/editor/format-italic';
import FormatUnderlinedIcon from 'material-ui/svg-icons/editor/format-underlined';
import LinkIcon from 'material-ui/svg-icons/content/link';

import richTextMessages from '../../../richTextMessages';
import coreMessages from '../../../../../core/coreMessages';
import { fieldNamesMessages } from '../../../../../appConfig/messages';

// const turnedOnStyle = { backgroundColor: 'darkGrey' };
// const turnedOnStyle = { boxShadow: 'inset 0px 0px 12px #bbb' };

const styles = {
  hovered: {
    backgroundColor: 'darkGrey',
  },
};

const buttonCount = width => Math.floor(width / 48);

const RichTextEditorToolbar2 = (props, context) => {
  const {
    disabledButtons,
    hideButtons,
    onFormatToggle,
    onPicturesOpen,
    onLinkToggle,
    onToggleBlockType,
    onValueSave,
    position,
    selectedButtonName,
    width,
    // turnedOnButtons,
  } = props;
  const { formatMessage } = context.intl;
  let style;
  switch (position) {
    case 'none':
      style = { display: 'none' };
      break;
    case 'fixed':
      style = {
        width: width ? `${width}px` : null,
        position: 'fixed',
        bottom: 0,
      };
      break;
    default:
      style = null;
  }
  const count = width ? buttonCount(width) : 1;
  // отборажаем <Toolbar /> без кнопок чтобы не просвечивали кнопки...
  // ... когда fixed тулбар наезжает на static
  return hideButtons ? (
    <Toolbar />
  ) : (
    <Toolbar style={style}>
      <ToolbarGroup firstChild>
        {count < 1 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={
              disabledButtons.SAVE ? null : formatMessage(coreMessages.Save)
            }
            tooltipPosition="top-center"
            disabled={disabledButtons.SAVE}
            onClick={onValueSave}
          >
            <SaveIcon />
          </IconButton>
        )}
        {count < 8 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.Bold)}
            tooltipPosition="top-center"
            onClick={() => onFormatToggle('BOLD')}
          >
            <FormatBoldIcon />
          </IconButton>
        )}
        {count < 9 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.Italic)}
            tooltipPosition="top-center"
            onClick={() => onFormatToggle('ITALIC')}
          >
            <FormatItalicIcon />
          </IconButton>
        )}
        {count < 10 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.Underlined)}
            tooltipPosition="top-center"
            onClick={() => onFormatToggle('UNDERLINE')}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        )}
        {count < 3 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            style={selectedButtonName === 'LINK' ? styles.hovered : {}}
            tooltip={
              disabledButtons.LINK ? null : formatMessage(richTextMessages.Link)
            }
            tooltipPosition="top-center"
            disabled={disabledButtons.LINK}
            onClick={onLinkToggle}
          >
            <LinkIcon />
          </IconButton>
        )}
        {count < 7 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(fieldNamesMessages.title)}
            tooltipPosition="top-center"
            onClick={() => onToggleBlockType('header-two')}
          >
            <TitleIcon />
          </IconButton>
        )}
        {count < 5 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.UnorderedList)}
            tooltipPosition="top-center"
            onClick={() => onToggleBlockType('unordered-list-item')}
          >
            <FormatListBulletedIcon />
          </IconButton>
        )}
        {count < 6 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.OrderedList)}
            tooltipPosition="top-center"
            onClick={() => onToggleBlockType('ordered-list-item')}
          >
            <FormatListNumberedIcon />
          </IconButton>
        )}
        {count < 4 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.Caption)}
            tooltipPosition="top-center"
            onClick={() => onToggleBlockType('blockquote')}
          >
            <DragHandleIcon />
          </IconButton>
        )}
        {count < 2 ? null : (
          <IconButton
            hoveredStyle={styles.hovered}
            tooltip={formatMessage(richTextMessages.Picture)}
            tooltipPosition="top-center"
            onClick={onPicturesOpen}
          >
            <InserPhotoIcon />
          </IconButton>
        )}
      </ToolbarGroup>
    </Toolbar>
  );
};

RichTextEditorToolbar2.propTypes = {
  disabledButtons: PropTypes.objectOf(PropTypes.bool),
  onFormatToggle: PropTypes.func.isRequired,
  onPicturesOpen: PropTypes.func.isRequired,
  onLinkToggle: PropTypes.func.isRequired,
  onToggleBlockType: PropTypes.func.isRequired,
  onValueSave: PropTypes.func.isRequired,
  selectedButtonName: PropTypes.string.isRequired,
  hideButtons: PropTypes.bool,
  position: PropTypes.string,
  width: PropTypes.number,
};

RichTextEditorToolbar2.defaultProps = {
  disabledButtons: {},
  hideButtons: false,
  position: 'static',
  width: null,
};

RichTextEditorToolbar2.contextTypes = {
  intl: intlShape.isRequired,
};

export default RichTextEditorToolbar2;
