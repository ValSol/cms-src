/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';

import Drawer from 'material-ui/Drawer';
import { spacing, typography, zIndex } from 'material-ui/styles';

import { goToAbsolutePath, handleEnterKeyDown } from '../../core/utils';
import { setRuntimeVariable } from '../../actions/runtime';
import SideNavSections from './SideNavSections';

import { appName } from '../../appConfig';

const handleClickHeader = () => {
  goToAbsolutePath();
};

const SideNav = (props, context) => {
  const {
    authorizedHeaderTabs,
    intl,
    docked,
    pathname,
    sideNavOpen,
    authorizedSideNavSections,
    toggleSideNav,
  } = props;

  // перенес styles из тела модуля внутрь функции, чтобы не выдавало ошибку:
  // TypeError: Cannot assign to read only property 'styles.logo.backgroundColor' of object '#<Object>'
  const styles = {
    logo: {
      cursor: 'pointer',
      fontSize: 24,
      color: typography.textFullWhite,
      lineHeight: `${spacing.desktopKeylineIncrement}px`,
      fontWeight: typography.fontWeightNormal,
      paddingLeft: spacing.desktopSubheaderHeight,
      marginBottom: 8,
    },
  };
  // если авторизованных секций нет - ничего не строим
  if (authorizedSideNavSections.length === 0) return null;

  styles.logo.backgroundColor = context.muiTheme.palette.primary1Color;

  const paddingBottom =
    authorizedHeaderTabs.length > 1 ? `${spacing.desktopSubheaderHeight}px` : 0;
  // чтобы не ругался реакт что запрещена мутакция объекта style
  if (styles.logo.paddingBottom !== paddingBottom) {
    styles.logo = { ...styles.logo };
  }
  styles.logo.paddingBottom = paddingBottom;
  // чтобы компонента SideNavSections корректно обновлялась при переходе
  // от роута к роуту устанавливаем ункикальный key для набора секций
  const SideNavSectionsKey = props.authorizedSideNavSections.join('|');
  return (
    <Drawer
      docked={docked}
      open={docked || sideNavOpen}
      containerStyle={{ zIndex: zIndex.drawer - 100 }}
      onRequestChange={toggleSideNav}
    >
      <div
        role="presentation"
        style={styles.logo}
        onClick={handleClickHeader}
        onKeyDown={event => handleEnterKeyDown(event, handleClickHeader)}
      >
        {appName}
      </div>
      <SideNavSections
        key={SideNavSectionsKey}
        intl={intl}
        pathname={pathname}
        authorizedSideNavSections={authorizedSideNavSections}
      />
    </Drawer>
  );
};

SideNav.propTypes = {
  authorizedHeaderTabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
  authorizedSideNavSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  intl: intlShape.isRequired,
  docked: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  sideNavOpen: PropTypes.bool.isRequired,
  toggleSideNav: PropTypes.func.isRequired,
};

SideNav.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

const mapStateToProps = (
  { runtime: { pathname, sideNavOpen } },
  { mediaType },
) => ({
  pathname,
  sideNavOpen,
  docked: mediaType === 'infinity' || mediaType === 'large',
});

const mapDispatchToProps = dispatch => ({
  toggleSideNav: open =>
    dispatch(
      setRuntimeVariable({
        name: 'sideNavOpen',
        value: open,
      }),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
