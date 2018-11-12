/* eslint-env jest */
import React from 'react';

import composeThingSideNavSection from '../../../../components/SideNav/composeThingSideNavSection/composeThingSideNavSection';

import { shallowWithIntl } from '../../../../../test/intlEnzymeHelper';

describe('Managing Article SideNavSection', () => {
  const pathname = '/en/patent/info';
  const locale = 'en';
  const thingConfig = {
    thingName: 'Article',
    messages: {
      NewArticle: {
        id: 'Article.NewArticle',
        defaultMessage: 'Новая публикация',
      },
      ManagingArticles: {
        id: 'Article.ManagingArticles',
        defaultMessage: 'Управление публикациями',
      },
      ExportOfArticles: {
        id: 'Article.ExportOfArticles',
        defaultMessage: 'Экспорт публикаций',
      },
      ImportOfArticles: {
        id: 'Article.ImportOfArticles',
        defaultMessage: 'Импорт публикаций',
      },
    },
  };
  test('should render section for ManagingArticles', () => {
    const ManagingThingSideNavSection = composeThingSideNavSection(thingConfig);
    const wrapper = shallowWithIntl(
      <ManagingThingSideNavSection locale={locale} pathname={pathname} />,
      locale,
    );
    // expect(wrapper.find('SelectableList')).toHaveLength(1);
    expect(wrapper.find('ListItem')).toHaveLength(2);
  });
});
