/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';

import AppBar from 'material-ui/AppBar';
import { spacing } from 'material-ui/styles';

import { appName } from '../../appConfig';
import { goToAbsolutePath } from '../../core/utils';
import { setRuntimeVariable } from '../../actions/runtime';

// компоненты включаемые в компоненту Header2
import HeaderVertMenu from './components/HeaderVertMenu';
import LangMenu from './components/LangMenu';
import SearchTextField from './components/SearchTextField';
import HeaderTabs from './components/HeaderTabs';

// ВНИМАНИЕ присутствует МАГИЯ!!!
// без укзания в CSS transition чудесным образом
// выезжающую appBar
const styles = {
  appBarAbsoluteStart: {
    // appBar прокручивается вместе с контентом
    position: 'absolute',
    flexWrap: 'wrap',
  },
  appBarAbsoluteEnd: {
    // appBar прокручивается вместе с контентом
    position: 'absolute',
    flexWrap: 'wrap',
    top: 0,
  },
  appBarFixed: {
    // appBar зафиксирована в окне браузера
    position: 'fixed',
    flexWrap: 'wrap',
    top: 0,
  },
  title: {
    cursor: 'pointer',
  },
  iconсContainer: {
    display: 'flex',
  },
};

const getTop = authorizedHeaderTabs =>
  authorizedHeaderTabs && authorizedHeaderTabs.length > 1
    ? spacing.desktopKeylineIncrement + spacing.desktopSubheaderHeight
    : spacing.desktopKeylineIncrement;

export class preHeader2 extends Component {
  static propTypes = {
    authorizedHeaderTabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    authorizedSideNavSections: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: intlShape.isRequired,
    mediaType: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    searchInputOpen: PropTypes.bool,
    showSideNav: PropTypes.func.isRequired,
    thingName: PropTypes.string.isRequired,
    user: PropTypes.objectOf(PropTypes.string),
  };
  static defaultProps = {
    searchInputOpen: false,
    user: null,
  };

  static getDerivedStateFromProps({ authorizedHeaderTabs, pathname }) {
    if (!this || !process.env.BROWSER) return null;
    // отрабатываем изменение высоты хедера
    const top = getTop(authorizedHeaderTabs);
    const currentTop = getTop(this.props.authorizedHeaderTabs);
    if (top !== currentTop) {
      styles.appBarAbsoluteStart = {
        ...styles.appBarAbsoluteStart,
        top: `-${top}px`,
      };
    }
    // если перешли на другую страницу отображаем header
    if (pathname !== this.props.pathname) {
      this.prevPageYOffset = window.pageYOffset;
      return { appBarStyle: styles.appBarAbsoluteEnd };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const top = getTop(props.authorizedHeaderTabs);
    styles.appBarAbsoluteStart.top = `-${top}px`;
    this.state = {
      appBarStyle: styles.appBarAbsoluteEnd,
    };
    if (process.env.BROWSER) {
      this.scrollHandler = this.scrollHandler.bind(this);
      this.prevPageYOffset = window.pageYOffset;
      this.banSetState = false;
    }
  }

  componentDidMount() {
    // устанавливаем обработчики глобальных событий
    if (process.env.BROWSER) {
      window.addEventListener('scroll', this.scrollHandler);
      // сохраняем текущий сдвиг, чтобы определять
      // дальнейшее направление скроллинга
      this.prevPageYOffset = window.pageYOffset;
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  scrollHandler() {
    if (this.banSetState) return;
    const { pageYOffset } = window;

    const top = getTop(this.props.authorizedHeaderTabs);

    if (this.prevPageYOffset - pageYOffset > 0) {
      // если скрол поменялся на направление ВВЕРХ
      // отображаем appBar вверху экрана
      if (this.state.appBarStyle !== styles.appBarFixed) {
        this.banSetState = true;
        this.setState({ appBarStyle: styles.appBarFixed }, () => {
          this.banSetState = false;
        });
      }
    } else if (pageYOffset <= top) {
      // есть скрол на участке который не далее высоты хедера
      if (this.state.appBarStyle !== styles.appBarAbsoluteEnd) {
        this.banSetState = true;
        this.setState({ appBarStyle: styles.appBarAbsoluteEnd }, () => {
          this.banSetState = false;
        });
      }
    } else if (
      this.prevPageYOffset - pageYOffset < 0 &&
      this.state.appBarStyle !== styles.appBarAbsoluteStart
    ) {
      // если скрол поменялся на направление ВНИЗ
      this.banSetState = true;
      this.setState({ appBarStyle: styles.appBarAbsoluteStart }, () => {
        this.banSetState = false;
      });
    }
    this.prevPageYOffset = pageYOffset;
  }

  render() {
    const {
      authorizedHeaderTabs,
      authorizedSideNavSections,
      intl,
      mediaType,
      searchInputOpen,
      showSideNav,
      thingName,
      user,
    } = this.props;

    const hideIcons = mediaType === 'extraSmall' && searchInputOpen;

    const rightIcons = (
      <div style={styles.iconсContainer}>
        <SearchTextField
          intl={intl}
          mediaType={mediaType}
          thingName={thingName}
        />
        {hideIcons || <LangMenu intl={intl} />}
        {hideIcons || <HeaderVertMenu intl={intl} user={user} />}
      </div>
    );
    // iconElementLeft={<IconButton><NavigationMenuIcon /></IconButton>}
    // так как NavigationMenuIcon все равно по умолчанию отображается
    return (
      <header>
        <AppBar
          title={
            !hideIcons && (
              <span
                style={styles.title}
                role="presentation"
                onClick={() => goToAbsolutePath()}
                onKeyDown={event => {
                  if (event.key === 'Enter') goToAbsolutePath();
                }}
              >
                {appName}
              </span>
            )
          }
          onLeftIconButtonClick={
            authorizedSideNavSections.length > 0 ? showSideNav : null
          }
          iconElementRight={rightIcons}
          showMenuIconButton={authorizedSideNavSections.length > 0}
          style={this.state.appBarStyle}
        >
          <HeaderTabs
            authorizedHeaderTabs={authorizedHeaderTabs}
            authorizedSideNavSections={authorizedSideNavSections}
            intl={intl}
            mediaType={mediaType}
          />
        </AppBar>
      </header>
    );
  }
}

const mapStateToProps = ({ runtime: { pathname, searchInputOpen } }) => ({
  pathname,
  searchInputOpen,
});

const mapDispatchToProps = dispatch => ({
  showSideNav: () =>
    dispatch(
      setRuntimeVariable({
        name: 'sideNavOpen',
        value: true,
      }),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(preHeader2);
