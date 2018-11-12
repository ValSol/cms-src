/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';

import { typography } from 'material-ui/styles';

import { goToAbsolutePath } from '../../../../core/utils';
import history from '../../../../history';
import { getPathForRoute } from '../../../../routes/routesUtils';

import userRouteMessages from '../../../../routes/user/userRouteMessages';

class HeaderVertMenu extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    // eslint-disable-next-line react/require-default-props
    user: PropTypes.objectOf(PropTypes.string),
  };

  handleVertMenuChange = (event, index) => {
    const { pathname } = history.location;
    // вместо того чтобы жестко вбивать path = "/signin", "signup" или "signout"
    // опеределяем path, как ближайший путь для которого используется
    // роут: signIn, signUp или signOut
    const absoluteBasePath = getPathForRoute(pathname, index);
    // в случае выхода (signout) сохраняем текующий путь
    // для возврата в при следующем входе (signin)
    if (index === 'signOut') {
      const { search } = history.location;
      // устанавливаем куки с путем для перехода
      const expiresIn = 60 * 60 * 24 * 7; // 7 days
      document.cookie = `next_path=${pathname}${search};path=/;max-age=${expiresIn}`;
    }
    goToAbsolutePath(absoluteBasePath);
  };

  render() {
    // получаем из контекста локаль и локаль по умолчанию и формируем
    // соответствующую часть адреса для ссылок на странице
    const { formatMessage } = this.props.intl;
    const { user } = this.props;

    const styles = {
      iconButtonElement: {
        color: typography.textFullWhite,
      },
      vertMenu: {
        minWidth: '264px',
      },
    };
    return (
      <IconMenu
        iconButtonElement={
          <IconButton iconStyle={styles.iconButtonElement}>
            <MoreVertIcon />
          </IconButton>
        }
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onChange={this.handleVertMenuChange}
        menuStyle={styles.vertMenu}
      >
        {!user && (
          <MenuItem
            primaryText={formatMessage(userRouteMessages.GoToTheEntrance)}
            value="signIn"
            leftIcon={<ExitToAppIcon />}
          />
        )}
        {!user && (
          <MenuItem
            primaryText={formatMessage(userRouteMessages.GoToTheRegistration)}
            value="signUp"
            leftIcon={<PersonAddIcon />}
          />
        )}
        {user && (
          <MenuItem
            primaryText={formatMessage(userRouteMessages.Signout)}
            value="signOut"
            leftIcon={<NavigationCloseIcon />}
          />
        )}
      </IconMenu>
    );
  }
}

export default HeaderVertMenu;
