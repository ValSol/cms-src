import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import deepEqual from 'deep-equal';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import { locales } from '../../../../../appConfig';
import messages from '../../../pictureMessages';
import { langMessages } from '../../../../../appConfig/messages';
import coreMessages from '../../../../../core/coreMessages';

class PictureForm extends React.Component {
  static propTypes = {
    // почему-то сообщал об undefined form поэтому убрал ".isRequired"
    form: PropTypes.string,
    fullWidth: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    value: PropTypes.PropTypes.oneOfType([PropTypes.string, PropTypes.object])
      .isRequired,
  };

  static defaultProps = {
    form: '',
  };

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    return { ...nextProps.value.caption };
  }

  constructor(props) {
    super(props);
    // получаем такой словарь: { uk: '', ru: '', en: '' }
    const { value: { caption } } = props;
    this.state = { ...caption };
  }

  handleFieldChange = (event, lang) => {
    this.setState({
      [lang]: event.target.value,
    });
  };

  handleChange = () => {
    const { form, onChange, value } = this.props;
    // убираем лишние пробелы
    const caption = locales.reduce(
      (prev, lang) => ({
        ...prev,
        [lang]: this.state[lang]
          .split(' ')
          .filter(Boolean)
          .join(' '),
      }),
      {},
    );
    onChange({ ...value, caption }, form);
  };

  handleKeyDown = event => {
    const { onClose } = this.props;
    switch (event.key) {
      case 'Escape':
        onClose();
        break;
      case 'Enter':
        this.handleChange();
        break;
      default:
      // ничего не предпринимаем
    }
  };

  render() {
    const { form, fullWidth, open, onClose, value } = this.props;
    const { formatMessage, locale } = this.context.intl;
    const contentStyle = fullWidth ? { width: '100%', maxWidth: 'none' } : null;
    const caption = locales.reduce(
      (prev, lang) => ({
        ...prev,
        [lang]: this.state[lang],
      }),
      {},
    );

    const textFields = locales.map(lang => (
      <TextField
        key={lang}
        disabled={form === 'PictureForm:delete'}
        floatingLabelText={formatMessage(langMessages[`CaptionIN${lang}`])}
        fullWidth
        onChange={event => this.handleFieldChange(event, lang)}
        value={this.state[lang]}
      />
    ));

    const actions = [
      <FlatButton
        label={formatMessage(coreMessages.Close)}
        // onClick чтобы кнопка срабатывала по клавише Enter
        // когда фокус на кнопке
        onClick={onClose}
        primary
      />,
      <FlatButton
        label={
          form === 'PictureForm:delete'
            ? formatMessage(messages.RemovePicture)
            : formatMessage(coreMessages.Save)
        }
        // onClick чтобы кнопка срабатывала по клавише Enter
        // когда фокус на кнопке
        onClick={this.handleChange}
        primary
        disabled={
          form === 'PictureForm:update' && deepEqual(caption, value.caption)
        }
      />,
    ];
    return (
      <Dialog
        actions={actions}
        autoScrollBodyContent
        contentStyle={contentStyle}
        onRequestClose={onClose}
        open={open}
        title={
          form === 'PictureForm:delete'
            ? formatMessage(messages.RemovingPicture)
            : formatMessage(messages.EditingPictureCaptions)
        }
      >
        <div onKeyDown={this.handleKeyDown} role="presentation">
          {textFields}
          <div>
            <img
              src={value.src}
              style={{ maxWidth: '100%' }}
              alt={this.state[locale]}
              title={this.state[locale]}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

export default PictureForm;
