/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { intlShape } from 'react-intl';

import { List, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';

import { locales, params } from '../../index';
import {
  composePathWithLocale,
  getAbsolutePath,
  getBreadcrumbs,
  sortItems,
} from '../../../core/utils';

import sideNavMessages from '../../../components/SideNav/sideNavMessages';
import { paramsMessages } from '../../messages';
import {
  composeListItems,
  extendListByOneItem,
} from '../../../components/SideNav/utils';
import graphqlPopulatedExcerpts from './excerptsPopulatedWithArticlesWithShortTitle2.graphql';

const SelectableList = makeSelectable(List);

export const preContentSideNavSection = (props, context) => {
  const {
    firstSection,
    locale,
    onlyOneSection,
    pathname,
    data: { loading, populatedExcerpts },
  } = props;
  const { intl: { formatMessage } } = context;

  // если загрузка НЕ закончена
  if (loading) {
    return (
      <div key="Content">
        {!firstSection && <Divider />}
        {!onlyOneSection && (
          <Subheader>{formatMessage(sideNavMessages.Content)}</Subheader>
        )}
        <LinearProgress mode="indeterminate" />
      </div>
    );
  }

  // если с сервера получен null или [] (пустой массив)
  // вместо компоненты возвращаем null
  if (!populatedExcerpts || populatedExcerpts.length === 0) return null;

  // отбираем все выборки соответствующие конкретному разделу
  // так, чтобы отобрать пути "/patent/info", "/patent/services"
  // отбор по subject = "/patent/"
  const subject = getBreadcrumbs(getAbsolutePath(pathname))[0];
  const selectedPopulatedExcerpts = populatedExcerpts.filter(
    item => item.subject === subject,
  );
  // сортируем выборки по section
  const sortedExcerpts = sortItems(
    selectedPopulatedExcerpts,
    [':section'],
    params,
  );
  const sortedArticles = sortedExcerpts.reduce(
    (prev, { items }) => prev.concat(items),
    [],
  );

  // строим иерархию навигации по статьям предназначенным одному subject
  const listItems = [];
  sortedArticles.forEach(item => {
    const { _id, section, shortTitle, slug } = item;
    const path = slug
      ? `/${subject}/${section}/${slug}`
      : `/${subject}/${section}`;
    extendListByOneItem(
      listItems,
      item,
      [
        {
          key: section,
          primaryText: formatMessage(paramsMessages[section]),
        },
        {
          key: _id,
          primaryText: shortTitle[locale],
        },
      ],
      composePathWithLocale(path, locale),
      pathname,
    );
  });

  return (
    <SelectableList value={pathname} key="Content">
      {!firstSection && <Divider />}
      {!onlyOneSection && (
        <Subheader>{formatMessage(sideNavMessages.Content)}</Subheader>
      )}
      {composeListItems(listItems)}
    </SelectableList>
  );
};

preContentSideNavSection.propTypes = {
  // items используются в нижележайшей функции поэтому объявляем PropTypes
  // eslint-disable-next-line react/no-unused-prop-types
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    populatedExcerpts: PropTypes.array,
  }).isRequired,
  firstSection: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  onlyOneSection: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
};

preContentSideNavSection.defaultProps = {
  firstSection: false,
  onlyOneSection: false,
};

preContentSideNavSection.contextTypes = {
  intl: intlShape.isRequired,
};

export default graphql(graphqlPopulatedExcerpts, {
  options: ({ locale }) => {
    // устанавливаем для какой локали загружатются данные
    // например { uk: true, ru: false, en: false }
    const variables = {};
    locales.forEach(item => {
      variables[item] = item === locale;
    });
    return { variables };
  },
})(preContentSideNavSection);
