/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import LanguageIcon from 'material-ui/svg-icons/action/language';
import { typography } from 'material-ui/styles';

import { locales } from '../../../../appConfig';
import { goToAnotherLocale } from '../../../../core/utils';
import { langMessages } from '../../../../appConfig/messages';

class LangMenu extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
  };
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
  }

  handleLocaleChange = (event, newLocale) => {
    const { intl: { locale } } = this.context.store.getState();
    if (newLocale !== locale) {
      // вызывается при cмене локали
      goToAnotherLocale(newLocale);
    }
  };

  render() {
    // получаем из контекста локаль и локаль по умолчанию и формируем
    // соответствующую часть адреса для ссылок на странице
    const { formatMessage } = this.props.intl;

    const styles = {
      iconButtonElement: {
        color: typography.textFullWhite,
      },
    };

    return (
      <IconMenu
        iconButtonElement={
          <IconButton
            tooltip={formatMessage(langMessages.CurrentLanguage)}
            tooltipPosition="bottom-center"
            iconStyle={styles.iconButtonElement}
          >
            <LanguageIcon />
          </IconButton>
        }
        value={this.props.intl.locale}
        onChange={this.handleLocaleChange}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {locales.map(locale => (
          <MenuItem
            key={locale}
            value={locale}
            primaryText={formatMessage(langMessages[`${locale}IN${locale}`])}
          />
        ))}
      </IconMenu>
    );
  }
}

export default LangMenu;
