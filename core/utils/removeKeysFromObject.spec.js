/* eslint-env jest */

import removeKeysFromObject from './removeKeysFromObject';

describe('removeKeysFromObject core util', () => {
  test('should not include kyes at first level', () => {
    const obj = {
      slug: 'abc',
      created: 1517044628653,
      updated: 1517122090231,
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
    };
    const keyNames = ['updated', 'created'];
    const expectedResult = {
      slug: 'abc',
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
    };
    const result = removeKeysFromObject(obj, keyNames);
    expect(result).toEqual(expectedResult);
  });
  test('should not include kyes at first and second level', () => {
    const obj = {
      slug: 'abc',
      title: {
        uk: 'Назва abc',
        ru: 'Название abc',
        en: 'Title abc',
        __typename: 'I18nStringsType',
      },
      created: 1517044628653,
      updated: 1517122090231,
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
      __typename: 'ArticleType',
    };
    const keyNames = ['updated', 'created', '__typename'];
    const expectedResult = {
      slug: 'abc',
      title: {
        uk: 'Назва abc',
        ru: 'Название abc',
        en: 'Title abc',
      },
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
    };
    const result = removeKeysFromObject(obj, keyNames);
    expect(result).toEqual(expectedResult);
  });
  test('should not include kyes at first and second level and in arrays', () => {
    const obj = {
      slug: 'abc',
      title: {
        uk: 'Назва abc',
        ru: 'Название abc',
        en: 'Title abc',
        __typename: 'I18nStringsType',
      },
      created: 1517044628653,
      updated: 1517122090231,
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
      pictures: [
        {
          initialName: 'Coala.jpg',
          caption: {
            uk: 'Коала',
            ru: 'Коала',
            en: 'Coala',
            __typename: 'I18nStringsType',
          },
          __typename: 'PictureType',
        },
        {
          initialName: 'Penguins.jpg',
          caption: {
            uk: 'Пінгвін',
            ru: 'Пингвин',
            en: 'Penguins',
            __typename: 'I18nStringsType',
          },
          __typename: 'PictureType',
        },
      ],
      items: [
        [
          [
            '11111',
            '22222',
            '33333',
            {
              test: 3,
              __typename: 'ArticleType',
            },
          ],
        ],
        '5a6db01f4b6e3f08dc65a440',
        '5a6db01f4b6e3f08dc65a43d',
        '5a6db01f4b6e3f08dc65a43e',
      ],
      __typename: 'ArticleType',
    };
    const keyNames = ['updated', 'created', '__typename'];
    const expectedResult = {
      slug: 'abc',
      title: {
        uk: 'Назва abc',
        ru: 'Название abc',
        en: 'Title abc',
      },
      createdAt: '2018-01-27T09:17:08.653Z',
      updatedAt: '2018-01-28T06:48:10.231Z',
      pictures: [
        {
          initialName: 'Coala.jpg',
          caption: {
            uk: 'Коала',
            ru: 'Коала',
            en: 'Coala',
          },
        },
        {
          initialName: 'Penguins.jpg',
          caption: {
            uk: 'Пінгвін',
            ru: 'Пингвин',
            en: 'Penguins',
          },
        },
      ],
      items: [
        [
          [
            '11111',
            '22222',
            '33333',
            {
              test: 3,
            },
          ],
        ],
        '5a6db01f4b6e3f08dc65a440',
        '5a6db01f4b6e3f08dc65a43d',
        '5a6db01f4b6e3f08dc65a43e',
      ],
    };
    const result = removeKeysFromObject(obj, keyNames);
    expect(result).toEqual(expectedResult);
  });
});
