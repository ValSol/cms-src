/* eslint-env jest */
import React from 'react';

import { preContentSideNavSection as ContentSideNavSection } from './ContentSideNavSection';

import { shallowWithIntl } from '../../../../test/intlEnzymeHelper';

describe('ContentSideNavSection', () => {
  const pathname = '/en/patent/info';
  const locale = 'en';
  const data = { loading: true };
  test('should render <LinearProgress /> if data.loading=true', () => {
    const wrapper = shallowWithIntl(
      <ContentSideNavSection data={data} locale={locale} pathname={pathname} />,
      locale,
    );
    expect(wrapper.find('LinearProgress')).toHaveLength(1);
  });
  test('should render empty component if data.populatedExcerpts = null (while data.loading=true)', () => {
    data.loading = false;
    data.populatedExcerpts = null;
    const wrapper = shallowWithIntl(
      <ContentSideNavSection data={data} locale={locale} pathname={pathname} />,
      locale,
    );
    expect(wrapper.debug()).toBe('');
  });
  test('should render empty component if data.populatedExcerpts = [] (while data.loading=true)', () => {
    data.loading = false;
    data.populatedExcerpts = null;
    const wrapper = shallowWithIntl(
      <ContentSideNavSection data={data} locale={locale} pathname={pathname} />,
      locale,
    );
    expect(wrapper.debug()).toBe('');
  });
  test('should render section for real data.populatedExcerpts', () => {
    data.loading = false;
    data.populatedExcerpts = [
      {
        __typename: 'PopulatedExcerptType',
        _id: '59306c57181ef610d4b80abe',
        thingName: 'Article',
        subject: 'patent',
        section: 'info',
        items: [
          {
            _id: '59306c4c181ef610d4b80a04',
            slug: '',
            section: 'info',
            shortTitle: {
              en: 'index page',
            },
          },
          {
            _id: '59306c4c181ef610d4b80a01',
            slug: 'abc',
            section: 'info',
            shortTitle: {
              en: 'abc - short',
            },
          },
          {
            _id: '59306c4c181ef610d4b80a02',
            slug: 'xyz',
            section: 'info',
            shortTitle: {
              en: 'xyz - short',
            },
          },
        ],
      },
      {
        __typename: 'PopulatedExcerptType',
        _id: '59306c57181ef610d4b80abf',
        thingName: 'Article',
        subject: 'patent',
        section: 'services',
        items: [
          {
            _id: '59306c4c181ef610d4b80a05',
            slug: '',
            section: 'services',
            shortTitle: {
              en: 'index page - services',
            },
          },
        ],
      },
    ];
    const wrapper = shallowWithIntl(
      <ContentSideNavSection data={data} locale={locale} pathname={pathname} />,
      locale,
    );
    // expect(wrapper.find('SelectableList')).toHaveLength(1);
    expect(wrapper.find('ListItem')).toHaveLength(2);
  });
});
