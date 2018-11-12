/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';

import queryString from 'query-string';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import SearchIcon from 'material-ui/svg-icons/action/search';
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close';
import { typography } from 'material-ui/styles';

import { setRuntimeVariable } from '../../../../actions/runtime';
import history from '../../../../history';
import { composePathWithLocale, getAbsolutePath } from '../../../../core/utils';
import {
  getNearestPath,
  getPathForRoute,
  makePathsList,
} from '../../../../routes/routesUtils';
import showAlarmDialog from '../../../Layout2/showAlarmDialog';

import headerMessages from '../../headerMessages';

const getAbsolutePathForSearch = (pathname, thingName) => {
  // вспомогательная утилита определяющая наиболее подходящий адрес роута поиска
  // выбирая из 2-х вариантов 1) роут поиска в контенте, например: articleSearchRoute
  // 2) роут поиска в административной части, например: articleSearchFormsRoute
  // который ближе текущему значению pathname
  const thingName2 = thingName.toLowerCase();

  // проверяем иммется ли в дереве роутов роут: `${thingName2}SearchRoute`
  const routeName = `${thingName2}SearchRoute`;
  const searchRoutePaths = makePathsList({ routeName });
  const absolutePathForSearchForm = getPathForRoute(
    pathname,
    `${thingName2}SearchFormsRoute`,
  );
  if (searchRoutePaths.length) {
    // если 2 различных роута возможно
    const absolutePathForSearch = getPathForRoute(
      pathname,
      `${thingName2}SearchRoute`,
    );
    const paths = [absolutePathForSearch, absolutePathForSearchForm];
    return getNearestPath(pathname, paths);
  }
  return absolutePathForSearchForm;
};

class SearchTextField extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    mediaType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    query: PropTypes.objectOf(PropTypes.string).isRequired,
    thingName: PropTypes.string.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { pathname, thingName } = props;
    // проверяем - на каком пути в данный момент находимся
    const absolutePathForSearch = getAbsolutePathForSearch(pathname, thingName);
    const absolutePath = getAbsolutePath(pathname);
    const isSearchPath = absolutePath.indexOf(absolutePathForSearch) === 0;
    this.state = {
      // если путь: "/search" и поисковая строка не пустая
      // строка поиска должна быть ОТКРЫТА
      search: !!props.query.q && isSearchPath,
      searchValue: props.query.q || '',
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
    this.onSearchButton = this.onSearchButton.bind(this);
    this.openSearch = this.openSearch.bind(this);
  }

  onSearchButton() {
    if (this.state.search) {
      this.makeSearch();
    } else {
      this.openSearch();
    }
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'Escape':
        this.closeSearch();
        break;
      case 'Enter':
        event.preventDefault();
        this.makeSearch();
        break;
      default:
      // ничего не предпринимаем
    }
  }

  handleChange = ({ target: { value } }) => {
    this.setState({
      searchValue: value,
    });
  };

  makeSearch() {
    const { intl: { locale }, thingName } = this.props;
    // получаем поисковый запрос
    // и убираем из него ненужные пробелы
    const q = this.state.searchValue
      .trim()
      .split(' ')
      .filter(Boolean)
      .join(' ');

    if (!q) return; // если пустая поисковая строка - выходим

    // получаем адрес перехода исходя из текущего адреса
    const { pathname } = history.location;
    const absolutePathForSearch = getAbsolutePathForSearch(pathname, thingName);

    this.setState({ searchValue: q });
    const search = queryString.stringify({ q });
    const href = `${composePathWithLocale(
      absolutePathForSearch,
      locale,
    )}?${search}`;

    // если предупреждение об уходе со страницы (alarmDialog) ...
    // ... отображать не надо просто осуществляе переход ...
    // ... в противном случае функция showAlarmDialog отобразит предупреждение
    if (!showAlarmDialog(this.context, href)) history.push(href);
  }

  openSearch() {
    this.setState({ search: true }, () =>
      this.props.dispatch(
        setRuntimeVariable({ name: 'searchInputOpen', value: true }),
      ),
    );
  }

  closeSearch() {
    const { thingName } = this.props;
    // если текущий адрес соответствует роуту поиска
    // то не чистим поисковую строку при закрытии
    const { pathname } = history.location;
    const absolutePathForSearch = getAbsolutePathForSearch(pathname, thingName);
    const absolutePath = getAbsolutePath(pathname);
    const searchValue =
      absolutePathForSearch === absolutePath ? this.state.searchValue : '';

    this.setState({ search: false, searchValue }, () =>
      this.props.dispatch(
        setRuntimeVariable({ name: 'searchInputOpen', value: false }),
      ),
    );
  }

  render() {
    // получаем из контекста локаль и локаль по умолчанию и формируем
    // соответствующую часть адреса для ссылок на странице
    const { formatMessage } = this.props.intl;
    // const langPath = locale === defaultLocale ? '' : `/${locale}`;
    // const { width } =  this.context;
    let searchWidth = 192;
    const { mediaType } = this.props;

    if (this.state.search) {
      // устанавлеваем высоту только для случая "открытой строки поиска"
      // чтобы не было конфликта SSR контента с контентом сгенерированным на клиетне
      switch (mediaType) {
        case 'extraSmall':
          searchWidth = 208;
          break;
        case 'small':
          searchWidth = 240;
          break;
        case 'medium':
          searchWidth = 384;
          break;
        default:
          searchWidth = 512;
          break;
      }
    }

    const styles = {
      searchText: {
        display: 'flex', // иначе кнопка поиска съезжает на вторую строку
      },
      iconButtonElement: {
        color: typography.textFullWhite,
      },
      showSearch: {
        maxWidth: `${searchWidth}px`,
        transition: 'max-width 0.25s ease-in',
        overflow: 'hidden',
      },
      hideSearch: {
        maxWidth: 0,
        transition: 'max-width 0.25s ease-out',
        overflow: 'hidden',
      },
      search: {
        width: searchWidth,
      },
    };

    const searchButton = (
      <IconButton
        iconStyle={styles.iconButtonElement}
        onClick={this.onSearchButton}
        tooltip={formatMessage(headerMessages.Search)}
        tooltipPosition="bottom-center"
      >
        <SearchIcon />
      </IconButton>
    );
    const closeButton = (
      <IconButton
        onClick={this.closeSearch}
        iconStyle={styles.iconButtonElement}
        style={{ width: '30px' }}
      >
        <NavigationCloseIcon />
      </IconButton>
    );

    return (
      <div style={styles.searchText}>
        {searchButton}
        <div style={this.state.search ? styles.showSearch : styles.hideSearch}>
          <MenuItem
            innerDivStyle={{
              padding: 0,
              backgroundColor: this.context.muiTheme.palette.primary1Color,
            }}
            rightIconButton={closeButton}
            style={styles.search}
          >
            <TextField
              id="siteSearchTextField"
              value={this.state.searchValue}
              onChange={this.handleChange}
              hintText={formatMessage(headerMessages.Search)}
              hintStyle={{ color: typography.textLightWhite }}
              inputStyle={{
                color: typography.textFullWhite,
                width: `${searchWidth - 24}px`,
              }}
              underlineStyle={styles.search}
              underlineFocusStyle={{ borderColor: typography.textFullWhite }}
              onKeyDown={this.handleKeyDown}
              autoFocus
              spellCheck={false}
            />
          </MenuItem>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ runtime: { pathname, query } }) => ({
  pathname,
  query,
});

export default connect(mapStateToProps)(SearchTextField);
