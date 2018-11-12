import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';

import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import AddToPhotosIcon from 'material-ui/svg-icons/image/add-to-photos';
import EditPhotosIcon from 'material-ui/svg-icons/image/edit';

import Dropzone from 'react-dropzone';

import { picturesSelectCellHeight as cellHeight } from '../../../appConfig';
import {
  getNewFilesMd5HashAndReplaceDuplicateFiles,
  humanFileSize,
  isLeftClickEvent,
  isModifiedEvent,
} from '../../../core/utils';
import PictureForm from './components/PictureForm';
import coreMessages from '../../../core/coreMessages';
import colsCount from '../colsCount';
import messages from '../pictureMessages';

class PicturesSelect extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    getFocusInput: PropTypes.func,
    // _id используется в mapStateToProps
    _id: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    mediaType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onClickTile: PropTypes.func, // обработчик клика по плитке вцелом
    style: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    value: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    disabled: false,
    getFocusInput: null,
    _id: null,
    onFocus: null,
    onClickTile: null,
    style: null,
    value: [],
  };

  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    // если изменились значения - обновляем ключи
    if (this && this.props.value !== nextProps.value) {
      const keys = nextProps.value.reduce(
        (prev, { src }) => ({ ...prev, [src]: src }),
        {},
      );
      return { keys };
    }
    return null;
  }

  constructor(props) {
    super(props);
    // устанавливаем ключи для каждой ячейки (плитки) через state
    // чтобы каждая ячейка (плитка) - по новой отрисовывалась на resize
    const keys = props.value.reduce(
      (prev, { src }) => ({ ...prev, [src]: src }),
      {},
    );
    this.state = {
      keys,
      pictureFormOpen: false,
      pictureFormValue: { caption: { uk: '', ru: '', en: '' } },
    };
  }

  componentDidMount() {
    // устанавливаем обработчики глобальных событий
    if (process.env.BROWSER) {
      // передаем в родительскую компоненту (PicturesSelectFieldChild)
      // ссылку на input элемент (focusInput) чтобы отрабатывался
      // и клик по надписи над полем ввода
      const { getFocusInput } = this.props;
      if (getFocusInput) getFocusInput(this.focusInput);
    }
  }

  handleDrop = (results, results2, event) => {
    event.stopPropagation();
    const { onChange, value } = this.props;
    getNewFilesMd5HashAndReplaceDuplicateFiles(value, results).then(
      ([newPictures, oldPictures]) => {
        const newValue = newPictures.concat(oldPictures);
        // добавляем в state - ключи для новых подгруженных картинок ...
        const keys = newValue.reduce(
          (prev, { src }) => ({ ...prev, [src]: src }),
          {},
        );
        this.setState(
          { keys }, // ... и обеспечиваем изменение value
          () => onChange(newValue),
        );
      },
    );
  };

  handleClickEditPictureTileIcon = (event, tile) => {
    event.stopPropagation();
    this.setState({
      pictureFormOpen: true,
      pictureFormValue: tile,
      form: 'PictureForm:update',
    });
  };

  handleClickRemovePictureTileIcon = (event, tile) => {
    event.stopPropagation();
    this.setState({
      pictureFormOpen: true,
      pictureFormValue: tile,
      form: 'PictureForm:delete',
    });
  };

  handleChangePicture = (tile, form) => {
    const { onChange, value } = this.props;
    const index = value.findIndex(({ src }) => src === tile.src);
    const newValue = value.slice(); // копируем массив
    if (form === 'PictureForm:delete') {
      // убираем удаленную "плитку"
      newValue.splice(index, 1);
    } else {
      // обновляем измененную "плитку"
      newValue[index] = tile;
    }
    this.setState({ pictureFormOpen: false }, () => {
      onChange(newValue);
      // после отработки изменения / удаления плитки
      // устанавилваем фокус на невидимый элемент input
      // чтобы иметь возможность в компоненте PictureSelectField
      // отрабатывать оnBlur при потере фокуса
      this.focusInput.focus();
    });
  };

  resizeHandler({ target: { outerWidth: width } }) {
    const { value } = this.props;
    // меняем ключи при изменении ширины экрана чтобы отрисовывались картинки
    // с новой шириной
    const keys = value.reduce(
      (prev, { src }) => ({ ...prev, [src]: `${src}:${width}` }),
      {},
    );
    this.setState({ keys });
  }

  composeEditPictureIconButton = (tile, twoIcons) => {
    const { disabled } = this.props;
    const { intl: { formatMessage } } = this.context;
    const style = twoIcons ? { paddingLeft: 0, width: '24px' } : null;
    return disabled ? null : (
      <IconButton
        onClick={event => this.handleClickEditPictureTileIcon(event, tile)}
        style={style}
        tooltip={formatMessage(coreMessages.Edit)}
        tooltipPosition="top-left"
      >
        <EditPhotosIcon color="white" />
      </IconButton>
    );
  };

  composeRemovePictureIconButton = tile => {
    const { disabled } = this.props;
    const { intl: { formatMessage } } = this.context;
    return disabled ? null : (
      <IconButton
        onClick={event => this.handleClickRemovePictureTileIcon(event, tile)}
        tooltip={formatMessage(messages.RemovePicture)}
        tooltipPosition="top-left"
      >
        <DeleteForeverIcon color="white" />
      </IconButton>
    );
  };

  handleImageLoad = (event, tile) => {
    // обработчик загрузки картинки, определяет размеры картинки
    const { onChange, value } = this.props;

    const {
      target: { naturalHeight, naturalWidth, offsetHeight, offsetWidth },
    } = event;
    // naturalHeight и naturalWidth - правильно определяют ...
    // ... размеры и в анимированных картинках,
    // но подстраховываемся с помощью offsetHeight и offsetWidth
    // height и width в текстовом виде т.к. при копипасте они становятся текстовыми
    const height = naturalHeight || offsetHeight;
    const width = naturalWidth || offsetWidth;
    const index = value.findIndex(({ src }) => src === tile.src);
    const newValue = value.slice(); // копируем массив
    newValue[index] = { ...tile, width, height };
    onChange(newValue);
  };

  render() {
    const {
      disabled,
      id,
      mediaType,
      onFocus,
      onClickTile,
      style,
      value,
    } = this.props;
    const {
      intl: { formatMessage, locale },
      muiTheme: { palette },
    } = this.context;

    // устанавливаем количество колонок в гриде
    const cols = colsCount(mediaType);
    const iconHoverColor = palette.primary1Color;
    const pathColor = palette.accent3Color;
    const gridTiles = value.map(tile => {
      const subtitle =
        tile.width && tile.height
          ? `${tile.width} x ${tile.height}, ${humanFileSize(tile.size)}`
          : `${humanFileSize(tile.size)}`;
      // если высота и ширина картинки уже известны или, если картинка
      // создается перетаскиванием непосредственно в тело контента
      // обрботчик загрузки handleLoadImg НЕ назначаем
      const handleLoadImg =
        (tile.width && tile.height) || tile.engaged.length
          ? null
          : event => this.handleImageLoad(event, tile);
      return (
        <GridTile
          key={this.state.keys[tile.src]}
          actionIcon={
            <div style={{ display: 'flex' }}>
              {this.composeEditPictureIconButton(tile, !tile.engaged.length)}
              {tile.engaged.length
                ? null
                : this.composeRemovePictureIconButton(tile)}
            </div>
          }
          onClick={
            !disabled &&
            onClickTile &&
            (event => {
              if (!isModifiedEvent(event) && isLeftClickEvent(event)) {
                onClickTile(event, tile);
              }
            })
          }
          style={!disabled && onClickTile ? { cursor: 'pointer' } : null}
          title={tile.caption[locale]}
          subtitle={subtitle}
        >
          <img
            src={tile.src}
            alt={tile.caption[locale]}
            onLoad={handleLoadImg}
            title={tile.caption[locale]}
          />
        </GridTile>
      );
    });
    // используем unshift чтобы вставить в начало массива кнопку ...
    // ... для добавления новых картинок
    const iconButtonTopPosition = cellHeight / 2 - 24;
    gridTiles.unshift(
      <div style={{ position: 'relative' }} key="LoadMorePictures">
        <Dropzone
          accept="image/*"
          disabled={disabled}
          style={{ border: 0 }}
          multiple
          onDrop={this.handleDrop}
        >
          <IconButton
            disabled={disabled}
            style={{
              position: 'absolute',
              left: '50%',
              top: `${iconButtonTopPosition}px`,
              transform: 'translateX(-50%)',
            }}
            tooltip={disabled ? null : formatMessage(messages.LoadMorePictures)}
          >
            <AddToPhotosIcon
              color={pathColor}
              hoverColor={disabled ? null : iconHoverColor}
            />
          </IconButton>
        </Dropzone>
      </div>,
    );
    return (
      <div onFocus={onFocus} style={style}>
        {/* input получающий фокус размещаем в самом верху div-контейнера
            чтобы не перескакивало отображение вниз когда картинки
            не помещаются на экране */}
        <input
          ref={input => {
            this.focusInput = input;
          }}
          style={{
            display: 'block',
            width: 0,
            height: 0,
            border: 'none',
          }}
        />
        <Dropzone
          accept="image/*"
          disabled={disabled}
          disableClick
          inputProps={{ id }}
          onDrop={this.handleDrop}
          multiple
          style={{ border: 0 }}
        >
          <GridList cellHeight={cellHeight} cols={cols}>
            {gridTiles}
          </GridList>
        </Dropzone>
        <PictureForm
          form={this.state.form}
          fullWidth={mediaType === 'extraSmall'}
          open={this.state.pictureFormOpen}
          onChange={this.handleChangePicture}
          onClose={() =>
            this.setState({ pictureFormOpen: false }, () =>
              this.focusInput.focus(),
            )
          }
          value={this.state.pictureFormValue}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ browser: { mediaType } }) => ({ mediaType });

export default connect(mapStateToProps)(PicturesSelect);
