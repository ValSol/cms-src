/* eslint-env jest */

import replaceNewFilesWithOldMd5Hash from './replaceNewFilesWithOldMd5Hash';

describe('replaceNewFilesWithOldMd5Hash core util', () => {
  const newArray = [
    {
      md5Hash: '1',
      src: 'blob:/1',
    },
    {
      md5Hash: '2',
      src: 'blob:/2',
    },
    {
      md5Hash: '1',
      src: 'blob:/1',
    },
    {
      md5Hash: '3',
      src: 'blob:/3',
    },
  ];
  test('should return union of updated newArray and oldArray', () => {
    const oldArray = [
      {
        md5Hash: '1',
        src: '/1',
      },
      {
        md5Hash: '01',
        src: '/01',
      },
      {
        md5Hash: '2',
        src: '/2',
      },
      {
        md5Hash: '02',
        src: '/02',
      },
      {
        md5Hash: '3',
        src: '/3',
      },
      {
        md5Hash: '03',
        src: '/03',
      },
    ];

    const expectedResult = [
      [
        {
          md5Hash: '1',
          src: '/1',
        },
        {
          md5Hash: '2',
          src: '/2',
        },
        {
          md5Hash: '3',
          src: '/3',
        },
      ],
      [
        {
          md5Hash: '01',
          src: '/01',
        },
        {
          md5Hash: '02',
          src: '/02',
        },
        {
          md5Hash: '03',
          src: '/03',
        },
      ],
    ];
    const result = replaceNewFilesWithOldMd5Hash(newArray, oldArray);
    expect(result).toEqual(expectedResult);
  });
  test('should return union of NOT updated newArray and oldArray', () => {
    const oldArray = [
      {
        md5Hash: '01',
        src: '/01',
      },
      {
        md5Hash: '02',
        src: '/02',
      },
      {
        md5Hash: '03',
        src: '/03',
      },
    ];

    const expectedResult = [
      [
        {
          md5Hash: '1',
          src: 'blob:/1',
        },
        {
          md5Hash: '2',
          src: 'blob:/2',
        },
        {
          md5Hash: '3',
          src: 'blob:/3',
        },
      ],
      [
        {
          md5Hash: '01',
          src: '/01',
        },
        {
          md5Hash: '02',
          src: '/02',
        },
        {
          md5Hash: '03',
          src: '/03',
        },
      ],
    ];
    const result = replaceNewFilesWithOldMd5Hash(newArray, oldArray);
    expect(result).toEqual(expectedResult);
  });
});
