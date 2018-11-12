import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import { reduxForm } from 'redux-form';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import { colors } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { plural } from 'pluralize';

import {
  composePathWithLocale,
  getAbsolutePath,
  getFieldValue,
  isLeftClickEvent,
  isModifiedEvent,
} from '../../../core/utils';
import history from '../../../history';
import { setRuntimeVariable } from '../../../actions/runtime';

import { getPathForRoute } from '../../../routes/routesUtils';
import composeValidate from './composeValidate';
import ButtonWithCircularProgress from '../../ButtonWithCircularProgress';
import showAlarmDialog from '../../Layout2/showAlarmDialog';
import FilesUploadDialog from '../../picturesComponents/FilesUploadDialog';
import composeFields from './composeFields';
import composeAsyncValidate from './composeAsyncValidate';
import composeShowStateName from './composeShowStateName';
import coreMessages from '../../../core/coreMessages';
import validationMessages from '../../validationMessages';
// import asyncValidate from './asyncValidate';

export class preThingForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      styles: {
        0: { transition: 'all 0.45s ease-in-out' },
        1: { backgroundColor: 'lightGrey', marginBottom: '2px' },
        2: { backgroundColor: 'lightGrey', marginBottom: '2px' },
      },
      openAlertDialog: false,
    };
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  componentDidUpdate(prevProps) {
    // ! содержимое метода идентично методу в MultiLingualRichTextEditor
    // если в форму вносятся изменения
    // устананвливаем соответстующую информацию в redux store
    // для использовании в компоненте Link2 чтобы при клике на ссылку ...
    // ... при несохраненной формы - выдавать диалог предлагающий остаться / перейти
    if (process.env.BROWSER) {
      const { dirty } = this.props;
      if (dirty !== prevProps.dirty) {
        const { pathname } = history.location;
        const absolutePath = getAbsolutePath(pathname);
        this.context.store.dispatch(
          setRuntimeVariable({ name: 'form', value: { dirty, absolutePath } }),
        );
      }
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      // убираем информацию из ридакс стора о недоредоктированной форме
      this.context.store.dispatch(
        setRuntimeVariable({ name: 'form', value: undefined }),
      );
    }
  }

  handleBeforeUnload = e => {
    const { dirty } = this.props;
    if (dirty) {
      const confirmationMessage = 'o/';
      e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
      return confirmationMessage; // Gecko, WebKit, Chrome <34
    }
    return undefined;
  };

  // handleLocationChange = e => {};

  handleCancelButtonClient = event => {
    const { intl: { locale }, thingConfig: { thingName } } = this.props;
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    // по клику переход к общему списку форм
    const { pathname, search } = history.location;
    // определяем absoluteFormPath, как ближайший путь
    // для которого используется роут списка, например: articleListForm
    const absoluteFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}ListRoute`,
    );
    const href = `${composePathWithLocale(absoluteFormPath, locale)}${search}`;

    // если предупреждение об уходе со страницы (alarmDialog) ...
    // ... отображать не надо просто осуществляе переход ...
    // ... в противном случае функция showAlarmDialog отобразит предупреждение
    if (!showAlarmDialog(this.context, href)) history.push(href);
  };

  handleTabChange = tabIndex => {
    const styles = { ...this.state.styles };
    styles[this.state.tabIndex] = {
      backgroundColor: 'lightGrey',
      marginBottom: '2px',
    };
    styles[tabIndex] = { transition: 'all 0.45s ease-in-out' };
    this.setState({ tabIndex, styles });
  };

  // метод удаляет subDocument из массива subDocument'ов
  removeSubDocumentFromArray = () => {
    const {
      subDocumentArrayName: arrayName,
      subDocumentArrayNameIndex: i,
    } = this.state;
    const { array, currentValues } = this.props;
    const { id } = getFieldValue(currentValues, arrayName)[i];
    array.remove(arrayName, i);
    this.setState({
      [composeShowStateName(arrayName, id)]: undefined,
      openAlertDialog: false,
    });
  };

  render() {
    const {
      initialValues: { _id },
      intl: { formatMessage },
      error,
      thingConfig: { messages, thingName },
      form,
      handleSubmit,
      mediaType,
      pristine,
      submitting,
      valid,
    } = this.props;
    const style = {
      Button: {
        marginTop: '16px',
        marginRight: '8px',
      },
    };

    // form прдставляется в виде  "ArticleForm:formActionType"
    // например "formActionType:delete" для удобства вычленяем formActionType
    // eslint-disable-next-line no-unused-vars
    const [foo, formActionType] = form.split(':');

    let formTitle;
    let submitButtonCaption;
    switch (formActionType) {
      case 'update':
        formTitle = formatMessage(messages[`EditingThe${thingName}`]);
        submitButtonCaption = formatMessage(coreMessages.SaveChanges);
        break;
      case 'delete':
        formTitle = formatMessage(messages[`DeletingThe${thingName}`]);
        submitButtonCaption = formatMessage(messages[`DeleteThe${thingName}`]);
        break;
      case 'recover':
        formTitle = formatMessage(messages[`The${thingName}Deleted`]);
        submitButtonCaption = formatMessage(messages[`RecoverThe${thingName}`]);
        break;
      default:
        formTitle = formatMessage(messages[`New${thingName}`]);
        submitButtonCaption = formatMessage(messages[`AddThe${thingName}`]);
        break;
    }

    const actions = [
      <FlatButton
        label={formatMessage(coreMessages.Cancel)}
        keyboardFocused
        onClick={() => this.setState({ openAlertDialog: false })}
        primary
      />,
      <FlatButton
        // добавли пустую строку '*' в label чтобы избавится от предупреждения ...
        // ... при инициализации формы
        label={this.state.alertDialogMessage || '*'}
        onClick={this.removeSubDocumentFromArray}
        primary
      />,
    ];

    // существенное ЗАМЕЧАНИЕ
    // для каждого поля формы указывается id вида
    // formName:fieldType:fieldName:locales
    // id в целом и fieldType в частности - используются в e2e тестах
    // сегменты locales, fieldName - не обязательны

    return (
      <div>
        <h1>{formTitle}</h1>
        {error ? (
          <Divider
            style={{ marginTop: '16px', backgroundColor: colors.red500 }}
          />
        ) : (
          <Divider style={{ marginTop: '16px' }} />
        )}
        {error && (
          <div style={{ color: colors.red500, marginTop: '8px' }}>
            {formatMessage(validationMessages[error])}
          </div>
        )}
        <form onSubmit={handleSubmit} id={form}>
          {composeFields(this)}
          <div>
            <RaisedButton
              id={`${form}:button:cancel`}
              label={formatMessage(messages[`GoToListOf${plural(thingName)}`])}
              style={style.Button}
              onClick={this.handleCancelButtonClient}
              fullWidth={mediaType === 'extraSmall'}
            />
            {'  '}
            <ButtonWithCircularProgress
              id={`${form}:button:submit`}
              disabled={
                !valid ||
                (pristine &&
                  !(
                    formActionType === 'delete' || formActionType === 'recover'
                  ))
              }
              fullWidth={mediaType === 'extraSmall'}
              label={submitButtonCaption}
              style={style.Button}
              submitting={submitting}
            />
          </div>
        </form>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.openAlertDialog}
          onRequestClose={() => this.setState({ openAlertDialog: false })}
        >
          {`${this.state.alertDialogMessage}?`}
        </Dialog>
        <FilesUploadDialog _id={_id} />
      </div>
    );
  }
}

preThingForm.propTypes = {
  array: PropTypes.objectOf(PropTypes.func).isRequired,
  error: PropTypes.string, // eslint-disable-line react/require-default-props
  change: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  // Этот проп используем composeFields
  clearAsyncError: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  dirty: PropTypes.bool.isRequired,
  thingConfig: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  currentValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  ),
  // eslint-disable-next-line react/no-unused-prop-types
  initialValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  ),
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  pathname: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  submitting: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
};

preThingForm.defaultProps = {
  clearAsyncError: null,
  currentValues: {},
  initialValues: {},
};

preThingForm.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

const reduxThingForm = reduxForm({
  touchOnBlur: false,
  touchOnChange: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true, // без этого не срабатывала реинициализация
})(preThingForm);

const mapStateToProps = (
  { browser: { mediaType }, form, runtime: { query, pathname } },
  // из пропсов получаем 1) thingConfig для конфигурации методов ...
  // validate и asyncValidate
  // 2) имя текущей формы (например: 'ArticleForm:update')
  // и используем под именем formName
  { thingConfig, form: formName },
) => ({
  mediaType,
  pathname,
  query,
  // получаем проинициализированные поля чтобы по сабмиту вычислять дельту
  // отбирая только измененные поля
  initialFields: form[formName] && form[formName].initial,
  // получаем текущее значение всех полей чтобы программно
  // обновлять поле pictures из RichTextField полей, а также использовать
  currentValues: form[formName] && form[formName].values,
  //--------------------
  // задаем параметры для reduxForm() в качестве props
  // задаем поля для которых производится onBlur валидация
  // например: ['subject', 'section', 'slug']
  asyncBlurFields: thingConfig.compoundIndexFieldSets.reduce((prev, set) => {
    set.forEach(({ name }) => {
      if (!prev.includes(name)) prev.push(name);
    });
    return prev;
  }, []),
  // задаем метод обеспечивающий валидацию
  validate: composeValidate(thingConfig),
  asyncValidate: composeAsyncValidate(thingConfig),
});

const reduxFormThingForm = connect(mapStateToProps)(reduxThingForm);
export default DragDropContext(HTML5Backend)(reduxFormThingForm);
