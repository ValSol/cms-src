/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-env jest */
/* eslint-disable padded-blocks */

import React from 'react';

import { intl, shallowWithIntl } from '../../../test/intlEnzymeHelper';

import { preLayout2 as Layout2 } from './Layout2';
import Footer2 from '../Footer2';

describe('Layout2', () => {
  const locale = 'uk';
  const wrapper = shallowWithIntl(
    <Layout2
      intl={intl(locale)}
      mediaType="infinity"
      setUser={() => {}}
      thingName="Article"
    >
      <div className="layoutChildren" />
    </Layout2>,
    locale,
  );
  test('should render <Connect(preHeader2) />', () => {
    expect(wrapper.find('Connect(preHeader2)')).toHaveLength(1);
  });
  test('should render <Connect(SideNav) />', () => {
    expect(wrapper.find('Connect(SideNav)')).toHaveLength(1);
  });
  test('should render <Footer2 />', () => {
    expect(wrapper.find(Footer2)).toHaveLength(1);
  });
  test('should render child node', () => {
    expect(wrapper.find('.layoutChildren')).toHaveLength(1);
  });
});
