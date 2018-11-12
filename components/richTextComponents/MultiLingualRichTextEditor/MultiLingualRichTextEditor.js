import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { connect } from 'react-redux';
import ReactGridLayout, { WidthProvider } from 'react-grid-layout';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s1 from 'react-grid-layout/css/styles.css';
import s2 from 'react-resizable/css/styles.css';
import Paper from 'material-ui/Paper';

import deepEqual from 'deep-equal';
import queryString from 'query-string';

import { locales } from '../../../appConfig';
import { langMessages } from '../../../appConfig/messages';
import { getAbsolutePath, saveState } from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';
import history from '../../../history';
import { setRuntimeVariable } from '../../../actions/runtime';

import RichTextEditor from '../RichTextEditor';
import FilesUploadDialog from '../../picturesComponents/FilesUploadDialog';
import s3 from './css/styles.css';
import getLayout from './getLayout';

const ReactGridLayoutWithWidth = WidthProvider(ReactGridLayout);

class preMultiLingualRichTextEditor extends Component {
  static propTypes = {
    dirty: PropTypes.bool.isRequired,
    richTextFieldName: PropTypes.string.isRequired,
    thing: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    mediaType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.objectOf(PropTypes.string).isRequired,
  };
  static contextTypes = {
    client: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    const { thingConfig } = props;
    const initialLayout = getLayout(props.mediaType, thingConfig);
    this.state = initialLayout;

    // устанавливаем флаг Диалого предупреждающего о выходе при ...
    // ... несохраненных данных
    this.state.openAlertDialog = false;

    // устанавливаем флаги инициализации гридов
    this.initialized = {};
    locales.forEach(locale => {
      this.initialized[locale] = false;
    });
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  componentDidUpdate(prevProps) {
    // ! содержимое метода идентично методу в ThingForm
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

  handleLayoutChange = layout => {
    // отрабатываем изменения лайаута только после перевоначальной...
    // ...инициализации высоты всех Гридов
    let initializedLayout = true;
    const { thingConfig: { thingName }, mediaType } = this.props;
    const state = {};
    locales.forEach((locale, i) => {
      if (layout[i].h === 1) initializedLayout = false;
      state[`${locale}Layout`] = layout[i];
    });
    if (initializedLayout) {
      saveState(`${mediaType}:${thingName}ContentEditorGridLayout`, layout);
      state.initializedLayout = true;
      this.setState(state);
    }
  };

  handleHeightChange = (height, locale) => {
    // отрабатываем изменение высоты редактируемой области грида
    const h = Math.ceil((height - 2) / 10);
    const state = this.state[`${locale}Layout`];
    if (h !== state.h) {
      this.setState({ [`${locale}Layout`]: { ...state, h } });
    }
  };

  render() {
    const {
      pathname,
      query,
      richTextFieldName,
      thing: { _id, title },
      thingConfig: { thingName },
      thingConfig,
    } = this.props;
    const { intl: { formatMessage } } = this.context;

    // вместо того чтобы вручную absoluteFormPath = "/admin/articles"
    // опеределяем formPath, как ближайший путь для которого используется,
    // например, роут: articleListRoute
    const absoluteFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}ListRoute`,
    );
    // формируем строку с параметрами для адреса
    const search = Object.keys(query).length
      ? `?${queryString.stringify(query)}`
      : '';

    const grids = locales.map(locale => (
      <Paper
        key={`${locale}-${this.state[`${locale}Layout`].h}`}
        zDepth={2}
        data-grid={this.state[`${locale}Layout`]}
      >
        <RichTextEditor
          key={`${_id}${locale}`}
          collapsedPagePath={`${absoluteFormPath}/${_id}${search}`}
          id={`${_id}${locale}`}
          locale={locale}
          onHeightChange={height => this.handleHeightChange(height, locale)}
          richTextFieldName={richTextFieldName}
          title={`${formatMessage(langMessages[`IN${locale}Briefly`])} | ${
            title[locale]
          }`}
          thingConfig={thingConfig}
        />
      </Paper>
    ));

    return (
      <div>
        <ReactGridLayoutWithWidth
          className="layout"
          cols={12}
          // выбрали 2, потому что...
          // общая высота грида равна (h - 1) * margin + h * rowHeight
          // а значит общая высота грида приращивается на rowHeight + margin
          // т.е. 2 + 8 = 10, и удобно вычислять какую h назначить
          // чтобы содержимое с высотой height влезло
          // по формуле: h = Math.ceil((height - 2) / 10);
          rowHeight={2}
          draggableHandle=".RichTextEditorDragHandle"
          onLayoutChange={this.handleLayoutChange}
          margin={[8, 8]} // по умолчанию [10, 10] но мы полюбляем кратное 8 :-)
          style={
            this.state.initializedLayout
              ? { visibility: 'visible' }
              : { visibility: 'hidden' }
          }
          // отменяем CSSTransforms чтобы работало position: fixed
          // для RichTextEditorToolbar2
          useCSSTransforms={false}
        >
          {grids}
        </ReactGridLayoutWithWidth>
        <FilesUploadDialog _id={_id} />
      </div>
    );
  }
}

const mapStateToProps = (
  { browser: { mediaType }, richtexteditor, runtime: { pathname, query } },
  { richTextFieldName, thingConfig: { thingName } },
) => {
  const { initial, values } = richtexteditor[
    `${thingName}:${richTextFieldName}`
  ];
  return {
    dirty: !deepEqual(initial, values),
    mediaType,
    pathname,
    query,
  };
};

const connectedMultiLingualRichTextEditor = connect(mapStateToProps)(
  preMultiLingualRichTextEditor,
);
export default withStyles(s1, s2, s3)(connectedMultiLingualRichTextEditor);
