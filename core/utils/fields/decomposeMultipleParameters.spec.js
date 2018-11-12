/* eslint-env jest */

import decomposeMultipleParameters from './decomposeMultipleParameters';

describe('decomposeMultipleParameters util', () => {
  const thingConfig = {
    paramFields: [
      {
        name: 'city',
        multiple: false,
      },
      {
        name: 'place',
        multiple: false,
      },
      {
        name: 'cuisine',
        multiple: true,
      },
      {
        name: 'type',
        multiple: true,
      },
    ],
  };
  test('should return if there are not multiple params', () => {
    const thingConfig2 = {
      paramFields: [
        {
          name: 'city',
          multiple: false,
        },
        {
          name: 'place',
          multiple: false,
        },
        // {
        //   name: 'cuisine',
        //   multiple: false,
        // },
        // {
        //   name: 'type',
        //   multiple: false,
        // },
      ],
    };
    const things = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
      },
    ];
    const expectedResult = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
      },
    ];
    const result = decomposeMultipleParameters(thingConfig2, things);
    expect(result).toEqual(expectedResult);
  });
  test('should return things if there are multiple params', () => {
    const things = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: ['ukraine'],
        type: ['pizza'],
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: ['french'],
        type: ['cafe'],
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: ['japan'],
        type: ['club'],
      },
    ];
    const expectedResult = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: 'ukraine',
        type: 'pizza',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'french',
        type: 'cafe',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'japan',
        type: 'club',
      },
    ];
    const result = decomposeMultipleParameters(thingConfig, things);
    expect(result).toEqual(expectedResult);
  });
  test('should return things if there are multiple params 2', () => {
    const things = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: ['ukraine', 'japan'],
        type: ['pizza', 'cafe'],
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: ['french', 'japan'],
        type: ['cafe', 'club'],
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: ['french', 'japan', 'ukraine'],
        type: ['club'],
      },
    ];
    const expectedResult = [
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: 'ukraine',
        type: 'pizza',
      },
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: 'ukraine',
        type: 'cafe',
      },
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: 'japan',
        type: 'pizza',
      },
      {
        _id: '1',
        city: 'Kyiv',
        place: 'Kyiv-1',
        cuisine: 'japan',
        type: 'cafe',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'french',
        type: 'cafe',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'french',
        type: 'club',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'japan',
        type: 'cafe',
      },
      {
        _id: '2',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'japan',
        type: 'club',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'french',
        type: 'club',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'japan',
        type: 'club',
      },
      {
        _id: '3',
        city: 'Kyiv',
        place: 'Kyiv-2',
        cuisine: 'ukraine',
        type: 'club',
      },
    ];
    const result = decomposeMultipleParameters(thingConfig, things);
    expect(result).toEqual(expectedResult);
  });
});
