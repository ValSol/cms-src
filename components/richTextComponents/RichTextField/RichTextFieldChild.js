import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import {
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import grey from '@material-ui/core/colors/grey';

import shallowEqual from 'recompose/shallowEqual';
import deepEqual from 'deep-equal';

import { goToAbsolutePath } from '../../../core/utils';
import {
  composeEmptyContentState,
  editorStateDecorator as decorator,
  getAllEntities,
  mediaBlockRenderer,
} from '../../../core/draft';

const styles = theme => ({
  // добавил div co style
  // minWidth = '100%' чтобы Editor не сжималяся по горизонтале в нуль
  // paddingBottom: '12px' чтобы placeHolder не заезжал вниз
  container: { minWidth: '100%', paddingTop: '8px', paddingBottom: '8px' },
  iconButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: grey[400],
    '&:hover': { color: theme.palette.primary.main },
  },
});

class RichTextFieldChild extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,
    // onBlur и onFocus чтобы отслеживать получение - отдачу факуса в FormControl
    // и соответственно установку / отмену состояния focused
    fullPagePath: PropTypes.string,
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    pictures: PropTypes.arrayOf(PropTypes.object).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
      ),
    ]).isRequired,
  };

  static defaultProps = {
    disabled: false,
    fullPagePath: '',
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      editorState: value
        ? EditorState.createWithContent(convertFromRaw(value), decorator)
        : EditorState.createWithContent(composeEmptyContentState(), decorator),
      value,
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState) ||
      !shallowEqual(this.context, nextContext)
    );
  }

  handleChange = editorState => {
    /* отличаеся от аналогичного метода в RichTextEditor тем что:
    1) пустое поле обеспечивает value = '' (чтобы срабатывал валидатор)
    2) вместо onPicturesChange(newPictures) используем change('pictures', newPictures)
    3) вместь `content:${lang}` используем пропс name
    4) если value изменено: синтезируем значение event и вызываем this.props.onChange(event)
    */

    const currentContent = editorState.getCurrentContent();
    let value = convertToRaw(currentContent);
    const changedValue = !deepEqual(value, this.state.value);
    // если никакого текста объект не содержит value = ''
    if (!currentContent.hasText()) value = '';

    // определяем вставлялись | удалялись ли картинки
    if (changedValue) {
      const picturesSrcs = getAllEntities(currentContent, 'IMAGE')
        .map(item => item.entity.getData().src)
        .sort();
      if (!deepEqual(picturesSrcs, this.picturesSrcs)) {
        // если список используемых картинок изменился
        // обновляем значения engaged для соответсвующей картинки в pictures
        const { change, name, pictures } = this.props;
        const newPictures = pictures.map(picture => {
          let engaged;
          if (picturesSrcs.indexOf(picture.src) === -1) {
            // если картинка НЕ задействована в контенте
            // удаляем (если имеется) информацию об использовании в контенте
            // например: было engaged = ['content:uk', 'content:en'] и lang = 'uk'
            // тогда стало engaged = ['content:en']
            engaged = picture.engaged.filter(item => item !== name);
          } else {
            // если картинка задействована в контенте
            // добавляем (если ее нет) информацию об использовании в контенте
            // например: было engaged = ['content:en'] и lang = 'uk'
            // тогда стало engaged = ['content:en', 'content:uk']
            engaged =
              picture.engaged.indexOf(name) === -1
                ? [...picture.engaged, name]
                : picture.engaged;
          }
          return { ...picture, engaged };
        });
        this.picturesSrcs = picturesSrcs;
        change('pictures', newPictures);
      }
    }

    const state = changedValue ? { editorState, value } : { editorState };
    this.setState(state, () => {
      // если сам текст не изменилcя, а, к примеру, только курсор поменял место
      // просто выходим
      if (!changedValue) return;
      // имитируем ввод данных
      const event = { target: { value } };
      this.props.onChange(event);
    });
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

  render() {
    const {
      classes,
      disabled,
      id,
      inputRef,
      fullPagePath,
      onFocus,
      onBlur,
    } = this.props;
    return (
      <div className={classes.container} id={id}>
        <Editor
          // editorKey чтобы идентично рендирелась компонента на сервере и на клиенте
          editorKey={id}
          key={id}
          blockRendererFn={mediaBlockRenderer}
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          readOnly={disabled}
          ref={inputRef}
        />
        {disabled || !fullPagePath ? null : (
          <IconButton
            onClick={() => {
              goToAbsolutePath(fullPagePath);
            }}
            className={classes.iconButton}
            aria-label="Fullscreen"
          >
            <FullscreenIcon />
          </IconButton>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(RichTextFieldChild);
