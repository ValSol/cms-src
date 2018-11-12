/* eslint-env jest */

import getMultipleParams from './getMultipleParams';

describe('getMultipleParams util', () => {
  test('should return dictionary for multiple params', () => {
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
    const expectedResult = {
      city: false,
      cuisine: true,
      place: false,
    };
    const result = getMultipleParams(thingConfig);
    expect(result).toEqual(expectedResult);
  });
});
