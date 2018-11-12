/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { plural } from 'pluralize';

import { List, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import { composePathWithLocale } from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';

import sideNavMessages from '../sideNavMessages';
import {
  composeListItems,
  extendListByOneItem,
} from '../../../components/SideNav/utils';

const SelectableList = makeSelectable(List);

// если загрузка НЕ закончена
const composeThingSideNavSection = thingConfig => {
  const ThingSideNavSection = (props, context) => {
    const { firstSection, locale, onlyOneSection, pathname } = props;
    const { intl: { formatMessage } } = context;
    const { messages, thingName } = thingConfig;

    // вместо того чтобы вручную, например: listPath = "/admin/articles"
    // опеределяем listPath, как ближайший путь для которого используется роут: ListRoute
    const thingName2 = thingName.toLowerCase();
    const absoluteListPath = getPathForRoute(
      pathname,
      `${thingName2}ListRoute`,
    );
    const absoluteAddPath = getPathForRoute(pathname, `${thingName2}AddRoute`);
    const absoluteExportPath = getPathForRoute(
      pathname,
      `${thingName2}ExportRoute`,
    );
    const absoluteImportPath = getPathForRoute(
      pathname,
      `${thingName2}ImportRoute`,
    );
    const absoluteDBStatusPath = getPathForRoute(
      pathname,
      `${thingName2}DBStatusRoute`,
    );

    const listPath = composePathWithLocale(absoluteListPath, locale);
    const addPath = composePathWithLocale(absoluteAddPath, locale);
    const exportPath = composePathWithLocale(absoluteExportPath, locale);
    const importPath = composePathWithLocale(absoluteImportPath, locale);
    const dBStatusPath = composePathWithLocale(absoluteDBStatusPath, locale);

    // строим иерархию для раздела общая информация
    const listItems = [];
    extendListByOneItem(
      listItems,
      null,
      [
        {
          key: 'Separatly',
          primaryText: formatMessage(sideNavMessages.Separatly),
        },
        {
          key: 'GeneralList',
          primaryText: formatMessage(sideNavMessages.GeneralList),
        },
      ],
      listPath,
      pathname,
    );
    extendListByOneItem(
      listItems,
      null,
      [
        {
          key: 'Separatly',
          primaryText: formatMessage(sideNavMessages.Separatly),
        },
        {
          key: 'NewThing',
          primaryText: formatMessage(messages[`New${thingName}`]),
        },
      ],
      addPath,
      pathname,
    );
    // пункт меню экспорт
    extendListByOneItem(
      listItems,
      null,
      [
        {
          key: 'InGeneral',
          primaryText: formatMessage(sideNavMessages.InGeneral),
        },
        {
          key: 'Export',
          primaryText: formatMessage(messages[`ExportOf${plural(thingName)}`]),
        },
      ],
      exportPath,
      pathname,
    );
    // пункт меню импорт
    extendListByOneItem(
      listItems,
      null,
      [
        {
          key: 'InGeneral',
          primaryText: formatMessage(sideNavMessages.InGeneral),
        },
        {
          key: 'Import',
          primaryText: formatMessage(messages[`ImportOf${plural(thingName)}`]),
        },
      ],
      importPath,
      pathname,
    );
    // пункт меню состояние базы данных
    extendListByOneItem(
      listItems,
      null,
      [
        {
          key: 'InGeneral',
          primaryText: formatMessage(sideNavMessages.InGeneral),
        },
        {
          key: 'DatabaseStatus',
          primaryText: formatMessage(sideNavMessages.DatabaseStatus),
        },
      ],
      dBStatusPath,
      pathname,
    );

    // строим иерархию навигации для упорядочивания статей по разделам
    return (
      <SelectableList value={pathname} key={`${thingName}Managing`}>
        {!firstSection && <Divider />}
        {!onlyOneSection && (
          <Subheader>
            {formatMessage(messages[`Managing${plural(thingName)}`])}
          </Subheader>
        )}

        {composeListItems(listItems)}
      </SelectableList>
    );
  };
  ThingSideNavSection.propTypes = {
    // items используются в нижележайшей функции поэтому объявляем PropTypes
    // eslint-disable-next-line react/no-unused-prop-types
    firstSection: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    onlyOneSection: PropTypes.bool,
    pathname: PropTypes.string.isRequired,
  };

  ThingSideNavSection.defaultProps = {
    firstSection: false,
    onlyOneSection: false,
  };

  ThingSideNavSection.contextTypes = {
    intl: intlShape.isRequired,
  };
  return ThingSideNavSection;
};

export default composeThingSideNavSection;
