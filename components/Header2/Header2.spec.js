/* eslint-env jest */
import React from 'react';

import { preHeader2 as Header2 } from './Header2';

import { intl, shallowWithIntl } from '../../../test/intlEnzymeHelper';

describe('Header2', () => {
  const locale = 'uk';
  const wrapper = shallowWithIntl(
    <Header2
      authorizedHeaderTabs={[]}
      authorizedSideNavSections={[]}
      intl={intl(locale)}
      mediaType="infinity"
      showSideNav={() => {}}
      pathname="/"
      thingName="Article"
      top={0}
    />,
    locale,
  );
  test('should render <AppBar />', () => {
    expect(wrapper.find('AppBar')).toHaveLength(1);
  });
});
