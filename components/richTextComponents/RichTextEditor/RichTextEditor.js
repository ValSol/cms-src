import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {
  convertToRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';
import deepEqual from 'deep-equal';

import { spacing } from 'material-ui/styles';

import { locales, paperPadding } from '../../../appConfig';
import {
  getNewFilesMd5HashAndReplaceDuplicateFiles,
  thereAreFilesForUpload,
} from '../../../core/utils';
import {
  insertMediaBlock,
  getAllEntities,
  getEntitiesInSelection,
  mediaBlockRenderer,
  setEntitiesInSelection,
  styleMap,
  unsetEntitiesInSelection,
  updateDataFromPicturesInRichText,
} from '../../../core/draft';
import {
  addRichtexteditorData,
  setRichtexteditorSubmitting,
  updateRichtexteditorContent,
  updateRichtexteditorPictures,
  updateRichtexteditorEditorState,
} from '../../../actions/richtexteditor';
import { update, updateWithFilesUpload } from '../../../routes/thing/utils';
import RichTextEditorToolbar from './components/RichTextEditorToolbar';
import RichTextEditorToolbar2 from './components/RichTextEditorToolbar2';
import LinkAddressPopover from './components/LinkAddressPopover';
import PicturesSelectDialog from './components/PicturesSelectDialog';
import getDataFromPath from './utils/getDataFromPath';

const handleStateOfToolbarButtons = (props, state) => {
  const { initialPictures, initialValue, pictures, submitting, value } = props;
  const selection = state.editorState.getSelection();
  const currentContent = state.editorState.getCurrentContent();
  // вычисляем состояние disabledButtons
  const SAVE =
    submitting ||
    !currentContent.hasText() ||
    (deepEqual(value, initialValue) && deepEqual(pictures, initialPictures));
  const LINK = selection.isCollapsed();

  // вычисляем состояние turnedOnButtons
  /* пока что turnedOnButtons не используется - красиво не получилось
  const focusKey = selection.getFocusKey();
  let focusOffset = selection.getFocusOffset();
  // используем стиль предыдущего (если он не первый) симвла
  // чтобы определить какой стиль будет использоваться
  // нужно еще !!! вычислять по последнему символу в предыдущей строке
  focusOffset = focusOffset && focusOffset - 1;
  const currentContent = state.editorState.getCurrentContent();
  const focusContentBlock = currentContent.getBlockForKey(focusKey);
  const inlineStyle = focusContentBlock.getInlineStyleAt(focusOffset);

  const BOLD = inlineStyle.has('BOLD');
  const ITALIC = inlineStyle.has('ITALIC');
  const UNDERLINE = inlineStyle.has('UNDERLINE');

  const  turnedOnButtons = { BOLD, ITALIC, UNDERLINE };
  */
  return {
    disabledButtons: { LINK, SAVE },
  };
};

class RichTextEditor extends Component {
  static propTypes = {
    addData: PropTypes.func.isRequired,
    collapsedPagePath: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    // проп initialPictures используется в handleStateOfToolbarButtons
    // eslint-disable-next-line react/no-unused-prop-types
    initialPictures: PropTypes.arrayOf(PropTypes.object).isRequired,
    // проп initialValue используется в handleStateOfToolbarButtons
    // eslint-disable-next-line react/no-unused-prop-types
    initialValue: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ),
    locale: PropTypes.string.isRequired,
    onHeightChange: PropTypes.func.isRequired,
    pictures: PropTypes.arrayOf(PropTypes.object).isRequired,
    richTextFieldName: PropTypes.string.isRequired,
    setSubmitting: PropTypes.func.isRequired,
    // проп submitting используется в handleStateOfToolbarButtons
    // eslint-disable-next-line react/no-unused-prop-types
    submitting: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    title: PropTypes.string.isRequired,
    updatePictures: PropTypes.func.isRequired,
    updateContent: PropTypes.func.isRequired,
    updateEditorState: PropTypes.func.isRequired,
    value: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ).isRequired,
  };

  static defaultProps = {
    initialValue: '',
  };

  static contextTypes = {
    client: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    store: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    if (!this) return null;
    const {
      locale,
      submitting,
      richTextFieldName,
      thingConfig: { thingName },
    } = this.props;
    // если была бы завершена
    const { store } = this.context;
    if (submitting && !nextProps.submitting) {
      // получаем editorState из redux store после того как он был обновлен ...
      // ... вызовом reducer'а addRichtexteditorData
      const { richtexteditor } = store.getState();
      const { editorState: currentEditorState } = richtexteditor[
        `${thingName}:${richTextFieldName}`
      ];
      return { editorState: currentEditorState[locale] };
    }
    return null;
  }

  constructor(props, context) {
    super(props);
    // editorState берем из redux store, а не объявляем в качестве props ...
    // ... чтобы не обновлялись props'ы при КАЖДОМ изменении editorState
    const { locale, richTextFieldName, thingConfig: { thingName } } = props;
    const { richtexteditor } = context.store.getState();
    const { editorState } = richtexteditor[`${thingName}:${richTextFieldName}`];
    const currentEditorState = editorState[locale];
    // объект задающий "включенные" кнопки
    /* const turnedOnButtons = {
      BOLD: false,
      ITALIC: false,
      UNDERLINE: false,
    }; */
    // объект задающий недоступные кнопки
    const disabledButtons = {
      LINK: true,
      SAVE: true,
    };

    this.state = {
      disabledButtons,
      editorState: currentEditorState,
      selectedButtonName: '',
      showLinkAddressPopover: false,
      showPicturesSelectDialog: false,
      toolbarPosition: 'none',
      // turnedOnButtons,
    };

    this.focus = () => this.editor.focus();
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      window.addEventListener('resize', this.syncHeight);
      window.addEventListener('scroll', this.scrollHandler);
    }
    this.syncHeight();
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('resize', this.syncHeight);
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  // почему-то eslint хочет этот метод загнать вниз переченя методов
  // eslint-disable-next-line react/sort-comp
  handleChange = editorState => {
    const {
      locale,
      pictures,
      richTextFieldName,
      value,
      updateContent,
      updateEditorState,
      updatePictures,
    } = this.props;
    // обновляем в state сотояние редактора и затем:
    // 1) асинхронно вызываем функцию выравнивания высоты поля редактора
    // 2) проверяем нет ли измениний касающихся списка картинок
    // 3) если были изменениея касающиеся картинок - обновляем список картинок в redux store
    // 4) если были изменения контента - обновляем контент в redux store
    this.setState({ editorState }, () => {
      // отрабатываем возможное изменение ВЫСОТЫ редактируемого поля
      setTimeout(() => this.syncHeight(), 16);
      updateEditorState(editorState);
      const currentContent = editorState.getCurrentContent();
      const newValue = convertToRaw(currentContent);
      const changedValue = !deepEqual(newValue, value);
      // определяем вставлялись | удалялись ли картинки
      if (changedValue) {
        const picturesSrcs = getAllEntities(currentContent, 'IMAGE')
          .map(item => item.entity.getData().src)
          .sort();
        if (!deepEqual(picturesSrcs, this.picturesSrcs)) {
          // если список используемых картинок изменился
          // обновляем значения engaged для соответсвующей картинки в pictures
          const newPictures = pictures.map(picture => {
            let engaged;
            if (!picturesSrcs.includes(picture.src)) {
              // если картинка НЕ задействована в контенте
              // удаляем (если имеется) информацию об использовании в контенте
              // например: было engaged = ['content:uk', 'content:en'] и locale = 'uk'
              // тогда стало engaged = ['content:en']
              engaged = picture.engaged.filter(
                item => item !== `${richTextFieldName}:${locale}`,
              );
            } else {
              // если картинка задействована в контенте
              // добавляем (если ее нет) информацию об использовании в контенте
              // например: было engaged = ['content:en'] и locale = 'uk'
              // тогда стало engaged = ['content:en', 'content:uk']
              engaged = !picture.engaged.includes(
                `${richTextFieldName}:${locale}`,
              )
                ? [...picture.engaged, `${richTextFieldName}:${locale}`]
                : picture.engaged;
            }
            return { ...picture, engaged };
          });
          this.picturesSrcs = picturesSrcs;
          // сохраняем обновленный массив картинок в рИдаксе!
          updatePictures(newPictures);
        }
        // сохраняем контент в рИдаксе!
        updateContent(newValue);
      }
    });
  };

  syncHeight = () => {
    if (this.containerDiv) {
      const { scrollHeight, scrollWidth } = this.containerDiv;
      if (
        scrollHeight !== this.scrollHeight ||
        scrollWidth !== this.scrollWidth
      ) {
        this.scrollHeight = scrollHeight;
        this.scrollWidth = scrollWidth;
        this.props.onHeightChange(scrollHeight);
      }
    }
  };

  scrollHandler = () => {
    // this.banSetState - запрещает повторный пересчет ...
    // ... пока не отработалось изменение состояния в state
    if (this.banSetState) return;
    const { pageYOffset, innerHeight: windowHeight } = window;
    const { bottom, top } = this.containerDiv.getBoundingClientRect();
    const topLimitation = top + spacing.desktopKeylineIncrement * 3;
    if (bottom < windowHeight || topLimitation > windowHeight) {
      // если положение окна таково что при любом направлении скрола ...
      // не следует отображать тулбар внизу экрана
      if (this.state.toolbarPosition !== 'none') {
        this.banSetState = true;
        this.setState({ toolbarPosition: 'none' }, () => {
          this.banSetState = false;
        });
      }
    } else if (this.prevPageYOffset - pageYOffset < 0) {
      // если скрол поменялся на направление ВВЕРХ
      // отображаем appBar вверху экрана
      if (this.state.toolbarPosition !== 'fixed') {
        this.banSetState = true;
        this.setState({ toolbarPosition: 'fixed' }, () => {
          this.banSetState = false;
        });
      }
    } else if (
      this.prevPageYOffset - pageYOffset > 0 &&
      this.state.toolbarPosition !== 'none'
    ) {
      // если скрол поменялся на направление ВНИЗ
      this.banSetState = true;
      this.setState({ toolbarPosition: 'none' }, () => {
        this.banSetState = false;
      });
    }
    this.prevPageYOffset = pageYOffset;
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command,
    );
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  handleFormatToggle = inlineStyle => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const editorStateWithNewInlineStyle = RichUtils.toggleInlineStyle(
      editorState,
      inlineStyle,
    );
    const editorStateWithSelection = EditorState.forceSelection(
      editorStateWithNewInlineStyle,
      selectionState,
    );
    this.handleChange(editorStateWithSelection);
  };

  handleToggleBlockType = blockType => {
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const editorStateWithNewBlockType = RichUtils.toggleBlockType(
      editorState,
      blockType,
    );
    const editorStateWithSelection = EditorState.forceSelection(
      editorStateWithNewBlockType,
      selectionState,
    );
    this.handleChange(editorStateWithSelection);
  };

  handleLinkAddressPopoverClose = () => {
    const { editorState } = this.state;
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();
    this.setState(
      {
        selectedButtonName: '',
        showLinkAddressPopover: false,
      },
      () => {
        // отменяем inlineStyle: FAKESELECTION
        const contentWithoutInlineStyle = Modifier.removeInlineStyle(
          currentContent,
          currentSelection,
          'FAKESELECTION',
        );
        // обновляем состояение редактора (editorState) устанавливая новый контент
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentWithoutInlineStyle,
        });
        this.handleChange(newEditorState);
      },
    );
  };

  handleLinkToggle = event => {
    // This prevents ghost click.
    event.preventDefault();
    const { editorState } = this.state;
    const currentContent = editorState.getCurrentContent();
    const currentSelection = editorState.getSelection();

    // получаем ПЕРВОЕ entity из попавших в selection
    const [link] = getEntitiesInSelection(editorState, 'LINK');
    // если entity выделено: получаем значение href
    const linkAddressValue = link ? link.entity.getData().href : '';
    this.setState(
      {
        selectedButtonName: 'LINK',
        showLinkAddressPopover: true,
        anchorEl: event.currentTarget,
        linkAddressValue,
      },
      () => {
        // включаем inlineStyle: FAKESELECTION
        const contentWithInlineStyle = Modifier.applyInlineStyle(
          currentContent,
          currentSelection,
          'FAKESELECTION',
        );
        // обновляем состояение редактора (editorState) устанавливая новый контент
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentWithInlineStyle,
        });
        this.handleChange(newEditorState);
      },
    );
  };

  handleLinkEnter = async linkValue => {
    // закрываем Popover и ...
    const { editorState } = this.state;
    const currentSelection = editorState.getSelection();
    // если путь соответствует конкретному экземпляру thing ...
    // ... формируем в путь ведущий к стандартному представлению ...
    // ... данного экземпляра thing в текущей locale
    const { locale } = this.props;
    const { client, intl, store } = this.context;
    const routerContext = {
      client,
      intl,
      locale,
      ping: true,
      store,
    };
    // получаем data который содержит 1) href - всегда и ...
    // ... если имеет место для данного пути 2) _id 3) thingName
    const data = linkValue && (await getDataFromPath(linkValue, routerContext));
    this.setState(
      {
        selectedButtonName: '',
        showLinkAddressPopover: false,
      },
      () => {
        let newEditorState;
        if (linkValue) {
          const entityAttributes = {
            type: 'LINK',
            mutability: 'MUTABLE',
            data,
          };
          // ... создаем новую (новые) entity ...
          newEditorState = setEntitiesInSelection(
            editorState,
            entityAttributes,
          );
        } else {
          // ... или удаляем (все) entity ...
          newEditorState = unsetEntitiesInSelection(editorState);
        }
        // отменяем inlineStyle: FAKESELECTION
        const currentContent = newEditorState.getCurrentContent();
        const contentWithoutInlineStyle = Modifier.removeInlineStyle(
          currentContent,
          currentSelection,
          'FAKESELECTION',
        );
        // обновляем состояение редактора (editorState) устанавливая новый контент
        newEditorState = EditorState.set(newEditorState, {
          currentContent: contentWithoutInlineStyle,
        });
        this.handleChange(newEditorState);
      },
    );
  };

  handlePicturesSelectDialogOpen = event => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      showPicturesSelectDialog: true,
    });
  };

  handlePicturesSelectDialogClose = () => {
    this.setState({
      selectedButtonName: '',
      showPicturesSelectDialog: false,
    });
  };

  handleClickTile = (event, tile) => {
    // метод вставляет указанную картинку ...
    // ... из списка выбранных картинок в контен
    const currentEditorState = this.state.editorState;
    const selection = currentEditorState.getSelection();
    const { src, width, height, caption } = tile;
    const entityAttributes = {
      type: 'IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        caption,
        src,
        width: width.toString(),
        height: height.toString(),
      },
    };
    // получаем обновленное состояние редактора
    const editorState = insertMediaBlock(
      currentEditorState,
      entityAttributes,
      selection,
    );
    // обновляем состояние редактора и производим сопутствующие действия ...
    // ... при помощи метода this.handleChange
    this.setState({ editorState, showPicturesSelectDialog: false }, () =>
      this.handleChange(editorState),
    );
  };

  handleImageEntityLoad = (event, src) => {
    // обработчик загрузки картинки, определяет размеры картинки
    const { pictures, updatePictures } = this.props;

    const {
      target: { naturalHeight, naturalWidth, offsetHeight, offsetWidth },
    } = event;
    // naturalHeight и naturalWidth - правильно определяют ...
    // ... размеры и в анимированных картинках,
    // но подстраховываемся с помощью offsetHeight и offsetWidth
    // height и width в текстовом виде т.к. при копипасте они становятся текстовыми
    const height = naturalHeight || offsetHeight;
    const width = naturalWidth || offsetWidth;
    const index = pictures.findIndex(picture => src === picture.src);
    const newPictures = pictures.slice(); // копируем массив
    newPictures[index].width = width;
    newPictures[index].height = height;
    updatePictures(newPictures);
  };

  handleDroppedFiles = (selection, files) => {
    // обработка файлов которые были перетянуты и брошены
    // при этом если файл графичесий
    // 1) вставляется файл в pictures (с возможной подменой на уже сохраненный)
    // и с вычислением md5 хеша
    // 2) вставляется файл в тело контента (с вычислением ширины и высоты)
    // 3) обновляется значение picture pictures (c укзанием ширины и высоты и то картинка engaged)

    // отфильтровываем только графический файлы
    const imageType = /^image\//;
    const imageFiels = files.filter(({ type }) => imageType.test(type));

    // если нет графических файлов - выходим
    if (!imageFiels.length) return;

    // палучаем md5hash для перетянутых файлов картинок
    // и при необходимости заменяем их на уже ранее подгруженные картинки

    const { locale, pictures, richTextFieldName, updatePictures } = this.props;
    let { editorState } = this.state;

    getNewFilesMd5HashAndReplaceDuplicateFiles(pictures, imageFiels).then(
      ([newPictures, oldPictures]) => {
        // так как картинка вставляется в тело контента
        // указываем что она занята (engaged)
        const newEngagedPictures = newPictures.map(picture => {
          const engaged = !picture.engaged.includes(
            `${richTextFieldName}:${locale}`,
          )
            ? [...picture.engaged, `${richTextFieldName}:${locale}`]
            : picture.engaged;
          return { ...picture, engaged };
        });
        // обновляем информацию в списке картинок в redux store
        updatePictures(newEngagedPictures.concat(oldPictures));

        // вставляем картинки в тело контента, только после того как отработается
        // изменение списка картинок
        newPictures.forEach(picture => {
          const { src, height, width, caption } = picture;
          const data = {
            caption,
            src,
            height: height ? height.toString() : null,
            width: width ? width.toString() : null,
          };
          // будем обрабатывать загрузку картинки чтобы определить ее размеры
          // только в случае если эти размеры еще не известны
          if (!height || !width) data.onLoad = this.handleImageEntityLoad;
          const entityAttributes = {
            type: 'IMAGE',
            mutability: 'IMMUTABLE',
            data,
          };
          editorState = insertMediaBlock(
            editorState,
            entityAttributes,
            selection,
          );
        });
        // обновляем состояние редактора
        this.handleChange(editorState);
      },
    );
  };

  handleSaveButton = () => {
    // отрабатываем сохранение данные

    const {
      addData,
      richTextFieldName,
      setSubmitting,
      thingConfig,
      thingConfig: { thingName },
    } = this.props;
    const { client, store, store: { dispatch } } = this.context;
    const {
      richtexteditor: {
        [`${thingName}:${richTextFieldName}`]: { initial, values: values0 },
      },
    } = store.getState();

    // формируем синтетическиe пропс - чтобы воспользоваться утилитами ...
    // update и updateWithFilesUpload
    const initialize = thing => {
      // объединяем результат сохранения и текущее исходное состояние
      const initial2 = {
        ...initial,
        ...thing,
        [richTextFieldName]: {
          ...initial[richTextFieldName],
          ...thing[richTextFieldName],
        },
      };
      addData(initial2);
      setSubmitting(false);
    };
    const props = { client, initialFields: initial, initialize };

    // отбираем только ИЗМЕНЕННЫЕ данные
    let values = values0;
    // eslint-disable-next-line no-underscore-dangle
    const fields = { _id: values._id };

    if (!deepEqual(initial.pictures, values.pictures)) {
      fields.pictures = values.pictures;
      // ВСЕГДА на всякий случай в контенте обновляем атрибуты всех вставленных
      // картинок, вдруг что-то менялось в картинках - чтобы контент соответствовал
      values = updateDataFromPicturesInRichText(values0, thingConfig);
    }
    locales.reduce((prev, locale) => {
      if (
        !deepEqual(
          initial[richTextFieldName][locale],
          values[richTextFieldName][locale],
        )
      ) {
        // eslint-disable-next-line no-param-reassign
        if (!prev[richTextFieldName]) prev[richTextFieldName] = {};
        // eslint-disable-next-line no-param-reassign
        prev[richTextFieldName][locale] = values[richTextFieldName][locale];
      }
      return prev;
    }, fields);

    // устанавливаем флаг сохранения данных и ...
    setSubmitting(true);
    // ... сохраняем данные
    if (thereAreFilesForUpload(fields, thingConfig)) {
      updateWithFilesUpload(fields, dispatch, props, thingConfig);
    } else {
      update(fields, dispatch, props, thingConfig);
    }
  };

  render() {
    const {
      id,
      collapsedPagePath,
      locale,
      pictures,
      title,
      updatePictures,
    } = this.props;

    // вычисляем какие кнопки тулбара должны быть disabledButtons, а какие нет
    const { disabledButtons } = handleStateOfToolbarButtons(
      this.props,
      this.state,
    );

    // формируем popover для ввода linkAddress
    const linkAddressPopover = !this.state.showLinkAddressPopover ? null : (
      <LinkAddressPopover
        anchorEl={this.state.anchorEl}
        onEnter={this.handleLinkEnter}
        onRequestClose={this.handleLinkAddressPopoverClose}
        open={this.state.showLinkAddressPopover}
        value={this.state.linkAddressValue}
      />
    );
    // формируем dialog для ввода картинки
    const picturesSelectDialog = (
      <PicturesSelectDialog
        id={id}
        onChange={updatePictures}
        onClickTile={this.handleClickTile}
        onClose={this.handlePicturesSelectDialogClose}
        open={this.state.showPicturesSelectDialog}
        value={pictures}
      />
    );

    const width = this.containerDiv ? this.containerDiv.clientWidth : null;

    // формируем тулбар отображаемый в верху окна редактора
    const richTextEditorToolbar = (
      <RichTextEditorToolbar
        collapsedPagePath={collapsedPagePath}
        toolbarTitleText={title}
        // turnedOnButtons={this.state.turnedOnButtons}
        width={width}
      />
    );

    // формируем тулбар отображаемый в внизу окна редактора
    const richTextEditorToolbar2 = (
      <RichTextEditorToolbar2
        disabledButtons={disabledButtons}
        hideButtons={this.state.toolbarPosition === 'fixed'}
        onFormatToggle={this.handleFormatToggle}
        onPicturesOpen={this.handlePicturesSelectDialogOpen}
        onLinkToggle={this.handleLinkToggle}
        onToggleBlockType={this.handleToggleBlockType}
        onValueSave={this.handleSaveButton}
        selectedButtonName={this.state.selectedButtonName}
        // turnedOnButtons={this.state.turnedOnButtons}
        width={width}
      />
    );

    // формируем тулбар отображаемый в внизу окна браузера (при скроле вниз)
    const richTextEditorToolbar2fixed = (
      <RichTextEditorToolbar2
        disabledButtons={disabledButtons}
        onFormatToggle={this.handleFormatToggle}
        onPicturesOpen={this.handlePicturesSelectDialogOpen}
        onLinkToggle={this.handleLinkToggle}
        onToggleBlockType={this.handleToggleBlockType}
        onValueSave={this.handleSaveButton}
        position={this.state.toolbarPosition}
        selectedButtonName={this.state.selectedButtonName}
        // turnedOnButtons={this.state.turnedOnButtons}
        width={width}
      />
    );

    return (
      <div>
        {/* еще один внешний контейнер чтобы пристегнуть ...
            ... дополнительную RichTextEditorToolbar2 компоненту ...
            ... которая отрисовывает всплывающий снизу тулбар при прокрутке */}
        <div
          style={{ fontSize: '16px', lineHeight: '24px' }}
          ref={div => {
            this.containerDiv = div;
          }}
        >
          <div className="RichTextEditorDragHandle" style={{ cursor: 'move' }}>
            {richTextEditorToolbar}
          </div>
          <div style={{ padding: `${paperPadding}px` }}>
            <Editor
              key={`${locale}-${id}`}
              editorKey={`${locale}-${id}`}
              blockRendererFn={mediaBlockRenderer}
              customStyleMap={styleMap}
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              handleDroppedFiles={this.handleDroppedFiles}
              onChange={this.handleChange}
              ref={div => {
                this.editor = div;
              }}
            />
          </div>
          {richTextEditorToolbar2}
          {linkAddressPopover}
          {picturesSelectDialog}
        </div>
        {richTextEditorToolbar2fixed}
      </div>
    );
  }
}

const mapStateToProps = (
  { richtexteditor },
  { locale, richTextFieldName, thingConfig: { thingName } },
) => {
  const data = richtexteditor[`${thingName}:${richTextFieldName}`];
  const { initial, values } = data;
  return {
    initialPictures: initial.pictures,
    initialValue: initial[richTextFieldName][locale],
    pictures: values.pictures,
    submitting: data.submitting,
    value: values[richTextFieldName][locale],
  };
};

const mapDispatchToProps = (
  dispatch,
  { locale, richTextFieldName, thingConfig },
) => ({
  updateEditorState: editorState =>
    dispatch(
      updateRichtexteditorEditorState({
        editorState: { [locale]: editorState },
        richTextFieldName,
        thingConfig,
      }),
    ),
  updatePictures: pictures =>
    dispatch(
      updateRichtexteditorPictures({
        pictures,
        richTextFieldName,
        thingConfig,
      }),
    ),
  updateContent: content =>
    dispatch(
      updateRichtexteditorContent({
        content: { [locale]: content },
        richTextFieldName,
        thingConfig,
      }),
    ),
  addData: thing =>
    // инициируем содержимое редукc стора
    dispatch(
      addRichtexteditorData({
        thing,
        richTextFieldName,
        thingConfig,
      }),
    ),
  setSubmitting: submitting =>
    dispatch(
      setRichtexteditorSubmitting({
        submitting,
        richTextFieldName,
        thingConfig,
      }),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(RichTextEditor);
