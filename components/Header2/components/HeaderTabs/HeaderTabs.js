/* eslint-disable no-bitwise */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import queryString from 'query-string';

import { Tab, Tabs } from 'material-ui/Tabs';
import { typography } from 'material-ui/styles';

import { composePathWithLocale } from '../../../../core/utils';
import history from '../../../../history';

import icons from './icons';
import { sideNavWidth } from '../../../../appConfig';
import { paramsMessages } from '../../../../appConfig/messages';
import showAlarmDialog from '../../../Layout2/showAlarmDialog';
import headerMessages from '../../headerMessages';

const calculateValue = ({ pathname, query }) => {
  // формируем строку с параметрами для адреса
  const search = Object.keys(query).length
    ? `?${queryString.stringify(query)}`
    : '';
  return `${pathname}${search}`;
};

// надо использовать не только сообщения хедера, но и paten, trademark и т.п.
// из SideNav сообщений

class HeaderTabs extends Component {
  static propTypes = {
    authorizedHeaderTabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
      .isRequired,
    authorizedSideNavSections: PropTypes.arrayOf(PropTypes.string).isRequired,
    intl: intlShape.isRequired,
    mediaType: PropTypes.string.isRequired,
    // pathname: PropTypes.string.isRequired,
    query: PropTypes.objectOf(PropTypes.string).isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    return { value: calculateValue(nextProps) };
  }

  constructor(props) {
    super(props);
    this.state = {
      value: calculateValue(props),
    };
  }

  handleTabsChange = tabIndex => {
    const { intl: { locale } } = this.props;
    const href = composePathWithLocale(tabIndex, locale);
    // если предупреждение об уходе со страницы (alarmDialog) ...
    // ... отображать не надо просто осуществляе переход ...
    // ... в противном случае функция showAlarmDialog отобразит предупреждение
    if (!showAlarmDialog(this.context, href)) history.push(href);
  };

  render() {
    const { formatMessage } = this.props.intl;
    const {
      authorizedHeaderTabs,
      authorizedSideNavSections,
      mediaType,
      query,
    } = this.props;

    // если авторизованных секций меньше 2 - ничего не строим
    if (authorizedHeaderTabs.length < 2) return null;

    const docked = mediaType === 'infinity' || mediaType === 'large';
    const thereIsSideNavSections = authorizedSideNavSections.length > 0;
    const paddingLeft =
      docked && thereIsSideNavSections ? `${sideNavWidth}px` : 0;
    let showTabIcons = mediaType === 'extraSmall' || mediaType === 'small';
    if (authorizedHeaderTabs.length < 3 && mediaType !== 'extraSmall') {
      showTabIcons = false;
    }
    const styles = {
      appBar: {
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
      tabs: {
        width: '100%',
        paddingLeft,
      },
    };

    // формируем строку с параметрами для адреса
    const search = Object.keys(query).length
      ? `?${queryString.stringify(query)}`
      : '';

    const headerTabsList = authorizedHeaderTabs.map(tab => {
      const { muiTheme: { palette: { accent1Color } } } = this.context;
      const [label, value] = tab;
      const Icon = icons[label];
      return (
        <Tab
          id={`headerTab:${label}`}
          icon={
            showTabIcons && (
              <Icon
                color={typography.textFullWhite}
                hoverColor={accent1Color}
              />
            )
          }
          key={label}
          label={
            !showTabIcons &&
            formatMessage(headerMessages[label] || paramsMessages[label])
          }
          value={`${value}${search}`}
        />
      );
    });

    return (
      <Tabs
        style={styles.tabs}
        value={this.state.value}
        onChange={this.handleTabsChange}
      >
        {headerTabsList}
      </Tabs>
    );
  }
}

const mapStateToProps = ({ runtime: { pathname, query } }, { mediaType }) => ({
  pathname,
  query,
  docked: mediaType === 'infinity' || mediaType === 'large',
});

export default connect(mapStateToProps)(HeaderTabs);
