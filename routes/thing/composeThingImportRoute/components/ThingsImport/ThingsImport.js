import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import Dropzone from 'react-dropzone';
import { animateScroll } from 'react-scroll';

import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import { colors } from 'material-ui/styles';

import { plural } from 'pluralize';
// import history from '../../history';
// import { isLeftClickEvent, isModifiedEvent } from '../../core/utils';
import validationMessages from '../../../../../components/validationMessages';
import { setRuntimeVariable } from '../../../../../actions/runtime';
import validateThing from './validateThing';
import importMessages from './importMessages';

class ThingsImport extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
  };
  static defaultProps = {
    error: '',
    loading: false,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    const { thingConfig: { messages, thingName } } = props;
    const { intl: { formatMessage } } = context;
    this.state = {
      errorText: '',
      floatingLabelText: formatMessage(
        messages[`${plural(thingName)}InJsonFormat`],
      ),
      thingErrors: [],
      value: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { error, loading } = this.props;
    // если ошибок нет и мутация осущствляющая импорт завершена ...
    // ... очищаем поле TextField содаржащее данные для импорта
    if (!error && !prevProps.error && !loading && prevProps.loading) {
      this.handleChange({ target: { value: '' } });
    }
  }

  handleChange = ({ target: { value: newValue } }) => {
    const { intl: { formatMessage }, store } = this.context;
    const { thingConfig, thingConfig: { messages, thingName } } = this.props;
    const { value } = this.state;
    const dataForStore = []; // массив данных для redux store
    const state = {};
    const delta = newValue.length - value.length;
    if (!newValue) {
      // если пустое значение
      state.floatingLabelText = formatMessage(
        messages[`${plural(thingName)}InJsonFormat`],
      );
      state.thingErrors = [];
      state.value = '';
      state.errorText = '';
      dataForStore.push(null); // thingsForImport
      dataForStore.push(null); // excerptsForImport
      dataForStore.push(''); // error
    } else {
      // если НЕ пустое значение
      try {
        const obj = JSON.parse(newValue);
        const things = obj[plural(thingName.toLowerCase())];
        const excerpts = obj[`${thingName.toLowerCase()}_excerpts`];

        // валидируем импортируемые things
        const thingErrors = things.reduce((prev, thing, i) => {
          const errors = validateThing(thing, thingConfig);
          if (Object.keys(errors).length) {
            prev.push(`${formatMessage(messages[thingName])} ${i}`);
            // добавляем сообщения об ошибках
            Object.keys(errors).forEach(key =>
              prev.push(
                `${key}: ${formatMessage(validationMessages[errors[key]])}`,
              ),
            );
          }
          return prev;
        }, []);

        if (!thingErrors.length) {
          // если ошибок обнаружено НЕ было
          const floatingLabelText1 = `${formatMessage(
            messages[`Prepared${plural(thingName)}ForImport`],
          )}: ${things.length}`;
          const floatingLabelText2 = excerpts
            ? `, ${formatMessage(importMessages.PreparedExcerpts)}: ${
                excerpts.length
              }`
            : '';
          state.floatingLabelText = `${floatingLabelText1}${floatingLabelText2}`;
          state.thingErrors = [];
          state.value = newValue;
          state.errorText = '';
          dataForStore.push(things); // thingsForImport
          dataForStore.push(excerpts || null); // excerptsForImport
          dataForStore.push(''); // error
        } else {
          // если в импортиремых things обнаружены ошибки - сообщаем об этом
          state.floatingLabelText = formatMessage(
            messages[`${plural(thingName)}InJsonFormat`],
          );
          state.thingErrors = thingErrors;
          state.value = newValue;
          state.errorText = formatMessage(validationMessages.InvalidDataFormat);
          dataForStore.push(null); // thingsForImport
          dataForStore.push(null); // excerptsForImport
          dataForStore.push(''); // error
        }
      } catch (err) {
        state.floatingLabelText = formatMessage(
          messages[`${plural(thingName)}InJsonFormat`],
        );
        state.value = newValue;
        state.errorText = formatMessage(validationMessages.InvalidDataFormat);
        dataForStore.push(null); // thingsForImport
        dataForStore.push(null); // excerptsForImport
        dataForStore.push('InvalidDataFormat'); // error
      }
    }

    this.setState(state, () => {
      if (delta > 64 && !state.errorText) {
        // если большой объем данных добавляем анимационное прокручинваие вверх
        setTimeout(() => animateScroll.scrollToTop(), 100);
      }
    });
    const [thingsForImport, excerptsForImport, error] = dataForStore;
    store.dispatch(
      setRuntimeVariable({ name: 'thingsForImport', value: thingsForImport }),
    );
    store.dispatch(
      setRuntimeVariable({
        name: 'excerptsForImport',
        value: excerptsForImport,
      }),
    );
    store.dispatch(setRuntimeVariable({ name: 'error', value: error }));
  };

  handleDrop = files => {
    const [file] = files;
    if (file) {
      // если был "дропнут" файл с расширением .json
      // помещаем содержимое файла в поле TextField
      // и отрабатываем данные из файла
      const reader = new FileReader();
      reader.onload = ({ target: { result } }) => {
        this.handleChange({ target: { value: result } });
        this.textField.focus();
      };
      reader.readAsText(file);
    }
  };

  render() {
    const { error, loading, title } = this.props;
    const { errorText, floatingLabelText, thingErrors, value } = this.state;
    const { intl: { formatMessage } } = this.context;
    const hintText = formatMessage(importMessages.InsertTextOrJsonFile);
    // комбинируем возможную общуую ошибку и перечень всех ошибок
    const errors = error
      ? [formatMessage(validationMessages[error]), ...thingErrors]
      : thingErrors;
    return (
      <div>
        <h1>{title}</h1>
        {error && (
          <Divider
            style={{ marginTop: '16px', backgroundColor: colors.red500 }}
          />
        )}
        {!!errors.length && (
          <div
            style={{
              color: colors.red500,
              lineHeight: '8px',
              marginTop: '8px',
            }}
          >
            {errors.map((err, i) => <p key={`${err}${-i}`}>{err}</p>)}
          </div>
        )}
        <Dropzone
          accept=".json"
          disableClick
          disabled={loading}
          style={{ border: 0 }}
          onDrop={this.handleDrop}
        >
          <TextField
            disabled={loading}
            errorText={errorText}
            id="importThingsTextField"
            floatingLabelText={floatingLabelText}
            fullWidth
            hintText={hintText}
            multiLine
            onChange={this.handleChange}
            ref={input => {
              this.textField = input;
            }}
            rows={2}
            value={value}
          />
        </Dropzone>
      </div>
    );
  }
}

const mapStateToProps = ({ runtime: { error, loading } }) => ({
  error,
  loading,
});

export default connect(mapStateToProps)(ThingsImport);
