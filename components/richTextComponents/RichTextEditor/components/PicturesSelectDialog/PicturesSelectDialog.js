import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import PicturesSelect from '../../../../picturesComponents/PicturesSelect';
import richTextMessages from '../../../richTextMessages';
import coreMessages from '../../../../../core/coreMessages';

const PicturesSelectDialog = (props, context) => {
  const { id, onChange, onClose, onClickTile, open, value } = props;
  const { formatMessage } = context.intl;
  const actions = [
    <FlatButton
      label={formatMessage(coreMessages.Close)}
      onClick={onClose}
      primary
    />,
  ];

  return open ? (
    <Dialog
      actions={actions}
      autoScrollBodyContent
      contentStyle={{ width: '100%', maxWidth: 'none' }}
      onRequestClose={onClose}
      open={open}
      title={formatMessage(richTextMessages.PicturesSelection)}
    >
      <PicturesSelect
        id={id}
        value={value}
        onChange={onChange}
        onClickTile={onClickTile}
      />
    </Dialog>
  ) : (
    // СКРЫТНО (display: 'none') монтируем компоненту PicturesSelect
    // для случая когда PicturesSelectDialog ЗАКРЫТ
    // чтобы работали диалоги сообщающие о сохранении файлов на сервере
    <PicturesSelect
      id={id}
      value={value}
      onChange={onChange}
      onClickTile={onClickTile}
      style={{ display: 'none' }}
    />
  );
};

PicturesSelectDialog.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickTile: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
};
PicturesSelectDialog.contextTypes = {
  intl: intlShape.isRequired,
};

export default PicturesSelectDialog;
