/* eslint-env jest */

import getParamsValues from './getParamsValues';

describe('getParamsValues util', () => {
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
  const paramsValues = {
    city: ['Dnepr', 'Kiev', 'Odesa'],
    place: ['Bereznyaky', 'Fontan', 'Moldovanka', 'Teremky', 'Naberezhnaya'],
    cuisine: ['Japanese', 'Moldovan', 'Turkish', 'Ukraine'],
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
    const result = getParamsValues(thingConfig, items0, paramsValues);
    const expectedResult = {
      city: [],
      cuisine: [],
      place: [],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if not filters', () => {
    const result = getParamsValues(thingConfig, items, paramsValues);
    const expectedResult = {
      city: ['Kiev', 'Odesa'],
      cuisine: ['Japanese', 'Moldovan', 'Ukraine'],
      place: ['Bereznyaky', 'Fontan', 'Moldovanka', 'Teremky'],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev"', () => {
    const query = { city: 'Kiev' };
    const result = getParamsValues(thingConfig, items, paramsValues, query);
    const expectedResult = {
      city: ['Kiev', 'Odesa'],
      cuisine: ['Japanese', 'Ukraine'],
      place: ['Bereznyaky', 'Teremky'],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev", cuisine: "Ukraine"', () => {
    const query = { city: 'Kiev', cuisine: 'Ukraine' };
    const result = getParamsValues(thingConfig, items, paramsValues, query);
    const expectedResult = {
      city: ['Kiev', 'Odesa'],
      cuisine: ['Japanese', 'Ukraine'],
      place: ['Bereznyaky', 'Teremky'],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev", cuisine: "Japanese"', () => {
    const query = { city: 'Kiev', cuisine: 'Japanese' };
    const result = getParamsValues(thingConfig, items, paramsValues, query);
    const expectedResult = {
      city: ['Kiev'],
      cuisine: ['Japanese', 'Ukraine'],
      place: ['Bereznyaky'],
    };
    expect(result).toEqual(expectedResult);
  });
  test('should return pararms values if filters city: "Kiev", cuisine: "Ukraine", place: "Bereznyaky"', () => {
    const query = { city: 'Kiev', cuisine: 'Ukraine', place: 'Bereznyaky' };
    const result = getParamsValues(thingConfig, items, paramsValues, query);
    const expectedResult = {
      city: ['Kiev'],
      cuisine: ['Japanese', 'Ukraine'],
      place: ['Bereznyaky', 'Teremky'],
    };
    expect(result).toEqual(expectedResult);
  });
});
