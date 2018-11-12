/* eslint-env jest */
import React from 'react';
import { ListItem } from 'material-ui/List';

import Link2 from '../../Link2';
import composeListItems from './composeListItems';

describe('SideNavSections Util composeListItems', () => {
  test('should compose empty list', () => {
    const hierarchyOfListItems = [];
    const result = composeListItems(hierarchyOfListItems);
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });
  test('should compose simple list', () => {
    const hierarchyOfListItems = [
      {
        primaryText: 'patent',
        nestedItems: [
          {
            primaryText: 'info',
            value: '/patent/info/abc',
          },
          {
            primaryText: 'services',
            value: '/patent/services',
          },
        ],
      },
    ];
    const result = composeListItems(hierarchyOfListItems);
    const expectedResult = [
      <ListItem
        primaryText="patent"
        primaryTogglesNestedList
        nestedItems={[
          <ListItem
            primaryText={
              <div>
                <Link2 href="/patent/info/abc">info</Link2>
              </div>
            }
            value="/patent/info/abc"
          />,
          <ListItem
            primaryText={
              <div>
                <Link2 href="/patent/services">services</Link2>
              </div>
            }
            value="/patent/services"
          />,
        ]}
      />,
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should compose simple list', () => {
    const hierarchyOfListItems = [
      {
        primaryText: 'patent',
        value: '/patent/info/abc',
        nestedItems: [
          {
            primaryText: 'info',
            secondaryText: 'info2',
            value: '/patent/info/abc',
          },
          {
            primaryText: 'services',
            secondaryText: 'services2',
            value: '/patent/services',
          },
        ],
      },
    ];
    const result = composeListItems(hierarchyOfListItems);
    const expectedResult = [
      <ListItem
        primaryText="patent"
        primaryTogglesNestedList
        value="/patent/info/abc"
        nestedItems={[
          <ListItem
            primaryText={
              <div>
                <Link2 href="/patent/info/abc">info</Link2>
              </div>
            }
            secondaryText="info2"
            value="/patent/info/abc"
          />,
          <ListItem
            primaryText={
              <div>
                <Link2 href="/patent/services">services</Link2>
              </div>
            }
            secondaryText="services2"
            value="/patent/services"
          />,
        ]}
      />,
    ];
    expect(result).toEqual(expectedResult);
  });
});
