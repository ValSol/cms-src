/* eslint-env jest */
import isMongoId from 'validator/lib/isMongoId';

import decorator from './composeEmptyContentState';
import getEntitiesData from './getEntitiesData';

describe('getEntitiesData core draft util', () => {
  const rawContent = {
    decorator,
    blocks: [
      {
        entityRanges: [{ offset: 8, length: 10, key: 0 }],
        key: 'line0',
        text: 'This is first link for test',
        type: 'unstyled',
      },
      {
        entityRanges: [],
        key: 'line1',
        text: 'Text without link',
        type: 'unstyled',
      },
      {
        entityRanges: [
          { offset: 8, length: 11, key: 1 },
          { offset: 33, length: 16, key: 0 },
        ],
        key: 'line2',
        text: 'This is second link. And this is first link again.',
        type: 'unstyled',
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/patent/info',
          _id: '5a9c3bb526331a1ba02b062f',
          thingName: 'Article',
        },
      },
      1: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/patent/info/abc',
          _id: '5a9c3bb526331a1ba02b0630',
          thingName: 'Article',
        },
      },
      2: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '5ac8b9cd6d500106ec111ec7',
          thingName: 'Service',
        },
      },
      3: {
        type: 'LINK2',
        mutability: 'MUTABLE',
        data: { href: '/admin/articles' },
      },
      4: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: '/trademark/info' },
      },
      5: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '12345',
          thingName: 'Service',
        },
      },
      6: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '5a97e8db20d03c11507603ac',
          thingName: 'Service666',
        },
      },
    },
  };

  const dataCheck = {
    _id: arg => arg && isMongoId(arg),
    thingName: arg => arg && ['Article', 'Service'].includes(arg),
  };

  const entityName = 'LINK';

  test('should return empty array of entities', () => {
    const rawContent0 = { entityMap: {} };
    const expectedResult = [];
    const result = getEntitiesData(rawContent0, entityName, dataCheck);
    expect(result).toEqual(expectedResult);
  });
  test('should return empty array of entities 2', () => {
    const expectedResult = [];
    const result = getEntitiesData(rawContent, 'LINK2', dataCheck);
    expect(result).toEqual(expectedResult);
  });
  test('should return array of entities', () => {
    const expectedResult = [
      {
        _id: '5a9c3bb526331a1ba02b062f',
        thingName: 'Article',
      },
      {
        _id: '5a9c3bb526331a1ba02b0630',
        thingName: 'Article',
      },
      {
        _id: '5ac8b9cd6d500106ec111ec7',
        thingName: 'Service',
      },
    ];
    const result = getEntitiesData(rawContent, 'LINK', dataCheck);
    expect(result).toEqual(expectedResult);
  });
});
