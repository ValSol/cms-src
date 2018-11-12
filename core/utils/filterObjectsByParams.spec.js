/* eslint-env jest */

import filterObjectsByParams from './filterObjectsByParams';

describe('filterObjectsByParams util', () => {
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
    ],
  };
  const items = [
    {
      city: 'Kiev',
      place: 'Bereznyaky',
      cuisine: ['Japanese'],
    },
    {
      city: 'Kiev',
      place: 'Bereznyaky',
      cuisine: ['Ukraine'],
    },
    {
      city: 'Kiev',
      place: 'Teremky',
      cuisine: ['Ukraine'],
    },
    {
      city: 'Odesa',
      place: 'Fontan',
      cuisine: ['Ukraine'],
    },
    {
      city: 'Odesa',
      place: 'Moldovanka',
      cuisine: ['Ukraine'],
    },
    {
      city: 'Odesa',
      place: 'Fontan',
      cuisine: ['Moldovan'],
    },
  ];
  test('should return empty result', () => {
    const items0 = [];
    const result = filterObjectsByParams(thingConfig, items0, {});
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });
  test('should return items if not filters', () => {
    const result = filterObjectsByParams(thingConfig, items, {});
    const expectedResult = items;
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev"', () => {
    const query = { city: 'Kiev' };
    const result = filterObjectsByParams(thingConfig, items, query);
    const expectedResult = [
      {
        city: 'Kiev',
        place: 'Bereznyaky',
        cuisine: ['Japanese'],
      },
      {
        city: 'Kiev',
        place: 'Bereznyaky',
        cuisine: ['Ukraine'],
      },
      {
        city: 'Kiev',
        place: 'Teremky',
        cuisine: ['Ukraine'],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev", cuisine: "Ukraine"', () => {
    const query = { city: 'Kiev', cuisine: 'Ukraine' };
    const result = filterObjectsByParams(thingConfig, items, query);
    const expectedResult = [
      {
        city: 'Kiev',
        place: 'Bereznyaky',
        cuisine: ['Ukraine'],
      },
      {
        city: 'Kiev',
        place: 'Teremky',
        cuisine: ['Ukraine'],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev", cuisine: "Japanese", place: "Bereznyaky"', () => {
    const query = { city: 'Kiev', cuisine: 'Ukraine', place: 'Bereznyaky' };
    const result = filterObjectsByParams(thingConfig, items, query);
    const expectedResult = [
      {
        city: 'Kiev',
        place: 'Bereznyaky',
        cuisine: ['Ukraine'],
      },
    ];
    expect(result).toEqual(expectedResult);
  });
});
