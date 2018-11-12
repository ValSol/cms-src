/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { intlShape } from 'react-intl';

import { List, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import LinearProgress from 'material-ui/LinearProgress';

import params from '../../params';
import { composePathWithLocale, sortItems } from '../../../core/utils';

import sideNavMessages from '../../../components/SideNav/sideNavMessages';
import { paramsMessages } from '../../messages';
import {
  composeListItems,
  extendListByOneItem,
} from '../../../components/SideNav/utils';
import graphqlPopulatedExcerpts from '../sideNavArticlePopulatedExcerpts.graphql';

const SelectableList = makeSelectable(List);

export const preAllContentSideNavSection = (props, context) => {
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
      <div key="ContentForAdmin">
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

  // сортируем выборки в соотвтетствии порядком указанном в pathTree
  const selectedArticles = populatedExcerpts
    // отфильтровываем пустые выборки
    // (пустые выборки могут возникнуть только в результате СБОЯ в базе данных)
    .filter(item => item.items.length)
    .map(item => ({ ...item, slug: item.items[0].slug }));
  // сортируем выборки по subject и section
  const sortedArticles = sortItems(
    selectedArticles,
    [':subject', ':section'],
    params,
  );

  // строим иерархию навигации по статьям по всем subject и section
  const listItems = [];
  sortedArticles.forEach(item => {
    const { subject, section, slug } = item;
    const path = slug
      ? `/${subject}/${section}/${slug}`
      : `/${subject}/${section}`;
    extendListByOneItem(
      listItems,
      item,
      [
        {
          key: subject,
          primaryText: formatMessage(paramsMessages[subject]),
        },
        {
          key: section,
          primaryText: formatMessage(paramsMessages[section]),
        },
      ],
      composePathWithLocale(path, locale),
      pathname,
    );
  });

  return (
    <SelectableList value={pathname} key="ContentForAdmin">
      {!firstSection && <Divider />}
      {!onlyOneSection && (
        <Subheader>{formatMessage(sideNavMessages.Content)}</Subheader>
      )}
      {composeListItems(listItems)}
    </SelectableList>
  );
};

preAllContentSideNavSection.propTypes = {
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

preAllContentSideNavSection.defaultProps = {
  firstSection: false,
  onlyOneSection: false,
};

preAllContentSideNavSection.contextTypes = {
  intl: intlShape.isRequired,
};

export default graphql(graphqlPopulatedExcerpts)(preAllContentSideNavSection);
