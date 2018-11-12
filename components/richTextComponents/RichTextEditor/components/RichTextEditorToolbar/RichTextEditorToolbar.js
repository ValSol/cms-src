import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import NavigationFullscreenExit from 'material-ui/svg-icons/navigation/fullscreen-exit';

import { goToAbsolutePath } from '../../../../../core/utils';
import richTextMessages from '../../../richTextMessages';

const styles = {
  hovered: {
    backgroundColor: 'darkGrey',
  },
};

const RichTextEditorToolbar = (props, context) => {
  const { collapsedPagePath, toolbarTitleText, width } = props;
  const { formatMessage } = context.intl;
  const toolbarTitle = (
    <div
      style={{
        width: `${width - 96}px`,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {toolbarTitleText}
    </div>
  );
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarTitle text={toolbarTitle} />
      </ToolbarGroup>
      <ToolbarGroup lastChild>
        <IconButton
          hoveredStyle={styles.hovered}
          tooltip={formatMessage(richTextMessages.Collapse)}
          tooltipPosition="bottom-left"
          onClick={() => goToAbsolutePath(collapsedPagePath)}
        >
          <NavigationFullscreenExit />
        </IconButton>
      </ToolbarGroup>
    </Toolbar>
  );
};

RichTextEditorToolbar.propTypes = {
  collapsedPagePath: PropTypes.string.isRequired,
  toolbarTitleText: PropTypes.string.isRequired,
  width: PropTypes.number,
  // turnedOnButtons: PropTypes.objectOf(PropTypes.bool).isRequired,
};

RichTextEditorToolbar.defaultProps = {
  width: 192,
};

RichTextEditorToolbar.contextTypes = {
  intl: intlShape.isRequired,
};

export default RichTextEditorToolbar;
