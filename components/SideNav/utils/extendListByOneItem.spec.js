/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import extendListByOneItem from './extendListByOneItem';

describe('SideNavSections Util extendListByOneItem', () => {
  test('should add ListItem to empty List that has only one level and no params', () => {
    const prev = [];
    const template = [
      {
        primaryText: 'GeneralList',
      },
    ];
    const path = '/admin/articles';
    const result = extendListByOneItem(prev, null, template, path);
    const expectedResult = [
      {
        primaryText: 'GeneralList',
        value: path,
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should add ListItem to empty List that has two levels and no params', () => {
    const prev = [];
    const template = [
      {
        primaryText: 'InGeneral',
      },
      {
        primaryText: 'GeneralList',
      },
    ];
    const path = '/admin/articles';
    const result = extendListByOneItem(prev, null, template, path);
    const expectedResult = [
      {
        primaryText: 'InGeneral',
        nestedItems: [
          {
            primaryText: 'GeneralList',
            value: path,
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should add ListItem that has two levels and no params', () => {
    const prev = [
      {
        primaryText: 'InGeneral',
        nestedItems: [
          {
            primaryText: 'GeneralList',
            value: '/admin/articles',
          },
        ],
      },
    ];
    const template = [
      {
        primaryText: 'InGeneral',
      },
      {
        primaryText: 'NewArticle',
      },
    ];
    const path = '/admin/articles/new';
    const currentPath = path;
    const result = extendListByOneItem(prev, null, template, path, currentPath);
    const expectedResult = [
      {
        primaryText: 'InGeneral',
        value: path,
        nestedItems: [
          {
            primaryText: 'GeneralList',
            value: '/admin/articles',
          },
          {
            primaryText: 'NewArticle',
            value: path,
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should add ListItem that has three levels and no params', () => {
    const prev = [
      {
        primaryText: 'InGeneral',
        nestedItems: [
          {
            primaryText: 'GeneralList',
            value: '/admin/articles',
          },
          {
            primaryText: 'NewArticle',
            value: '/admin/articles/new',
          },
        ],
      },
    ];
    const template = [
      {
        primaryText: 'InGeneral',
      },
      {
        primaryText: 'NewArticle',
      },
      {
        primaryText: 'NewArticlePlus',
      },
    ];
    const path = '/admin/articles/plus';
    const result = extendListByOneItem(prev, null, template, path, path);
    const expectedResult = [
      {
        primaryText: 'InGeneral',
        value: path,
        nestedItems: [
          {
            primaryText: 'GeneralList',
            value: '/admin/articles',
          },
          {
            primaryText: 'NewArticle',
            value: '/admin/articles/new',
          },
          {
            primaryText: 'NewArticle',
            value: path,
            nestedItems: [
              {
                primaryText: 'NewArticlePlus',
                value: path,
              },
            ],
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  // ниже тестируем посроние иерархии с использованием параметров
  test('should add ListItem to empty List that has two levels', () => {
    const prev = [];
    const template = [
      {
        primaryText: ':subject',
      },
      {
        primaryText: ':section',
      },
    ];
    const item = { subject: 'patent', section: 'info', slug: 'abc' };
    const path = '/patent/info/abc';
    const result = extendListByOneItem(prev, item, template, path);
    const expectedResult = [
      {
        primaryText: 'patent',
        nestedItems: [
          {
            primaryText: 'info',
            value: path,
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should add ListItem to List that has two levels', () => {
    const prev = [
      {
        primaryText: 'patent',
        nestedItems: [
          {
            primaryText: 'info',
            value: '/patent/info/abc',
          },
        ],
      },
    ];
    const template = [
      {
        primaryText: ':subject',
      },
      {
        primaryText: ':section',
      },
    ];
    const item = { subject: 'patent', section: 'services', slug: '' };
    const path = '/patent/services';
    const currentPath = path;
    const result = extendListByOneItem(prev, item, template, path, currentPath);
    const expectedResult = [
      {
        primaryText: 'patent',
        value: path,
        nestedItems: [
          {
            primaryText: 'info',
            value: '/patent/info/abc',
          },
          {
            primaryText: 'services',
            value: path,
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should add third ListItem to List that has two levels', () => {
    const currentPath = '/patent/services';
    const prev = [
      {
        primaryText: 'patent',
        value: currentPath,
        nestedItems: [
          {
            primaryText: 'info',
            value: '/patent/info/abc',
          },
          {
            primaryText: 'services',
            value: currentPath,
          },
        ],
      },
    ];
    const template = [
      {
        primaryText: ':subject',
      },
      {
        primaryText: 'price',
      },
    ];
    const item = { subject: 'patent', slug: '' };
    const path = '/patent/price';
    const result = extendListByOneItem(prev, item, template, path, currentPath);
    const expectedResult = [
      {
        primaryText: 'patent',
        value: currentPath,
        nestedItems: [
          {
            primaryText: 'info',
            value: '/patent/info/abc',
          },
          {
            primaryText: 'services',
            value: currentPath,
          },
          {
            primaryText: 'price',
            value: path,
          },
        ],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
