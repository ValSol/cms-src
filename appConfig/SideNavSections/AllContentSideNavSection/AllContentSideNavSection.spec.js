/* eslint-env jest */
import React from 'react';

import { preAllContentSideNavSection as AllContentSideNavSection } from './AllContentSideNavSection';

import { shallowWithIntl } from '../../../../test/intlEnzymeHelper';

describe('AllContentSideNavSection', () => {
  const pathname = '/en/patent/info';
  const locale = 'en';
  const data = { loading: true };
  test('should render <LinearProgress /> if data.loading=true', () => {
    const wrapper = shallowWithIntl(
      <AllContentSideNavSection
        data={data}
        locale={locale}
        pathname={pathname}
      />,
      locale,
    );
    expect(wrapper.find('LinearProgress')).toHaveLength(1);
  });
  test('should render empty component if data.populatedExcerpts = null (while data.loading=true)', () => {
    data.loading = false;
    data.populatedExcerpts = null;
    const wrapper = shallowWithIntl(
      <AllContentSideNavSection
        data={data}
        locale={locale}
        pathname={pathname}
      />,
      locale,
    );
    expect(wrapper.debug()).toBe('');
  });
  test('should render empty component if data.populatedExcerpts = [] (while data.loading=true)', () => {
    data.loading = false;
    data.populatedExcerpts = null;
    const wrapper = shallowWithIntl(
      <AllContentSideNavSection
        data={data}
        locale={locale}
        pathname={pathname}
      />,
      locale,
    );
    // eslint-disable-next-line no-unused-expressions
    expect(wrapper.debug()).toBe('');
  });
  test('should render section for real data.populatedExcerpts', () => {
    data.loading = false;
    data.populatedExcerpts = [
      {
        __typename: 'PopulatedExcerptType',
        _id: '59306c57181ef610d4b80ac0',
        thingName: 'Article',
        subject: 'design',
        section: 'info',
        items: [
          {
            slug: '',
          },
        ],
      },
      {
        __typename: 'PopulatedExcerptType',
        _id: '59306c57181ef610d4b80abe',
        thingName: 'Article',
        subject: 'patent',
        section: 'info',
        items: [
          {
            slug: '',
          },
          {
            slug: 'abc',
          },
          {
            slug: 'xyz',
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
            slug: '',
          },
        ],
      },
    ];
    const wrapper = shallowWithIntl(
      <AllContentSideNavSection
        data={data}
        locale={locale}
        pathname={pathname}
        firstSection
        onlyOneSection
      />,
      locale,
    );
    // expect(wrapper.find('SelectableList')).toHaveLength(1);
    expect(wrapper.find('ListItem')).toHaveLength(2);
  });
});
