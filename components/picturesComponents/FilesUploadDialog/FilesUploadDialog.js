import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';

import { axiosInitial as axiosInitialAction } from '../../../actions/axios';
import { FAIL, PROGRESS } from '../../../reducers/axios';
import messages from '../pictureMessages';
import coreMessages from '../../../core/coreMessages';

// диалог используется совместно с PicturesSelect, но монтируется ...
// ... отдельно, работает автономно ориентируясь на то чтобы сокрытие PicturesSelect не прятало FilesUploadDialog

const FilesUploadDialog = (props, context) => {
  const { requestState, axiosInitial } = props;
  const { formatMessage } = context.intl;
  const actions = [
    <FlatButton
      label={formatMessage(coreMessages.Close)}
      onClick={axiosInitial}
      primary
    />,
  ];

  return (
    <Dialog
      actions={actions}
      title={formatMessage(messages.LoadingImageFiles)}
      modal
      open={requestState === PROGRESS || requestState === FAIL}
    >
      <LinearProgress
        mode={requestState === FAIL ? 'determinate' : 'indeterminate'}
        value={0} // чтобы когда ошибка была сплошная серая полоса
      />
      {requestState === FAIL && (
        <div>{formatMessage(messages.LoadingImageFilesError)}</div>
      )}
    </Dialog>
  );
};

FilesUploadDialog.propTypes = {
  axiosInitial: PropTypes.func.isRequired,
  requestState: PropTypes.string,
};
FilesUploadDialog.defaultProps = {
  requestState: null,
};
FilesUploadDialog.contextTypes = {
  intl: intlShape.isRequired,
};

const mapStateToProps = (
  {
    // получаем requestState только соответсвующий текущему _id
    // чтобы редакторый в других окнах не реагировали на изменение requestState
    axios: { requestState },
  },
  { _id },
) =>
  requestState && requestState[0] === _id
    ? { requestState: requestState[1] }
    : { requestState: null };

const mapDispatchToProps = dispatch => ({
  axiosInitial: () => dispatch(axiosInitialAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilesUploadDialog);
