/* eslint-env jest */

import composeThingGqlVariablesByCompoundIndexes from './composeThingGqlVariablesByCompoundIndexes';

describe('composeThingGqlVariablesByCompoundIndexes graphQL utils', () => {
  const compoundIndexFieldSets = [
    [
      {
        name: 'subject',
        order: 1,
      },
      {
        name: 'section',
        order: 1,
      },
      {
        name: 'slug',
        order: 1, // может быть 1 или -1
      },
    ],
    [
      {
        name: 'subject',
        order: 1,
      },
      {
        name: 'slug',
        order: 1, // может быть 1 или -1
      },
    ],
  ];
  const paramFields = [
    {
      name: 'subject',
      multiple: true,
      required: true,
    },
    {
      name: 'section',
      multiple: true,
      required: true,
    },
  ];

  test('should return array of arrays of values for GraphQL', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const thing = { subject: ['patent'], section: ['info'], slug: 'abc' };
    const result = composeThingGqlVariablesByCompoundIndexes(
      thingConfig,
      thing,
    );
    const expectedResult = [
      [{ subject: 'patent', section: 'info', slug: 'abc' }],
      [{ subject: 'patent', slug: 'abc' }],
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return array of arrays of values for GraphQL 2', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const thing = {
      subject: ['patent', 'copyright', 'design'],
      section: ['info', 'services'],
      slug: 'abc',
    };
    const result = composeThingGqlVariablesByCompoundIndexes(
      thingConfig,
      thing,
    );
    const expectedResult = [
      [
        { subject: 'patent', section: 'info', slug: 'abc' },
        { subject: 'copyright', section: 'info', slug: 'abc' },
        { subject: 'design', section: 'info', slug: 'abc' },
        { subject: 'patent', section: 'services', slug: 'abc' },
        { subject: 'copyright', section: 'services', slug: 'abc' },
        { subject: 'design', section: 'services', slug: 'abc' },
      ],
      [
        { subject: 'patent', slug: 'abc' },
        { subject: 'copyright', slug: 'abc' },
        { subject: 'design', slug: 'abc' },
      ],
    ];
    expect(result).toEqual(expectedResult);
  });
});
