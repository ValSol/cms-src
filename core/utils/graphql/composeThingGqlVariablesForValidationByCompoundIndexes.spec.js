/* eslint-env jest */

import composeThingGqlVariablesForValidationByCompoundIndexes from './composeThingGqlVariablesForValidationByCompoundIndexes';

describe('composeThingGqlVariablesForValidationByCompoundIndexes graphQL utils', () => {
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
        name: 'slug2',
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
    const values = { subject: ['patent'], section: ['info'], slug: 'abc' };
    const notParamFieldNamesInUse = ['slug', 'slug2'];
    const variablesSets = [
      [{ subject: 'patent', section: 'info', slug: 'abc' }],
      [{ subject: 'patent', slug2: '' }],
    ];
    const expectedResult = { notParamFieldNamesInUse, variablesSets };
    const result = composeThingGqlVariablesForValidationByCompoundIndexes(
      thingConfig,
      values,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of arrays of values for GraphQL 2', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const values = {
      subject: ['patent', 'copyright', 'design'],
      section: ['info', 'services'],
      slug: 'abc',
    };
    const notParamFieldNamesInUse = [
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
      'slug2',
      'slug2',
      'slug2',
    ];
    const variablesSets = [
      [
        { subject: 'patent', section: 'info', slug: 'abc' },
        { subject: 'copyright', section: 'info', slug: 'abc' },
        { subject: 'design', section: 'info', slug: 'abc' },
        { subject: 'patent', section: 'services', slug: 'abc' },
        { subject: 'copyright', section: 'services', slug: 'abc' },
        { subject: 'design', section: 'services', slug: 'abc' },
      ],
      [
        { subject: 'patent', slug2: '' },
        { subject: 'copyright', slug2: '' },
        { subject: 'design', slug2: '' },
      ],
    ];
    const expectedResult = { notParamFieldNamesInUse, variablesSets };
    const result = composeThingGqlVariablesForValidationByCompoundIndexes(
      thingConfig,
      values,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of arrays of values for GraphQL 3', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const values = {
      subject: ['patent', 'copyright', 'design'],
      section: ['info', 'services'],
      slug: 'abc',
    };
    const blurredFieldName = 'subject';
    const notParamFieldNamesInUse = [
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
      'slug2',
      'slug2',
      'slug2',
    ];
    const variablesSets = [
      [
        { subject: 'patent', section: 'info', slug: 'abc' },
        { subject: 'copyright', section: 'info', slug: 'abc' },
        { subject: 'design', section: 'info', slug: 'abc' },
        { subject: 'patent', section: 'services', slug: 'abc' },
        { subject: 'copyright', section: 'services', slug: 'abc' },
        { subject: 'design', section: 'services', slug: 'abc' },
      ],
      [
        { subject: 'patent', slug2: '' },
        { subject: 'copyright', slug2: '' },
        { subject: 'design', slug2: '' },
      ],
    ];
    const expectedResult = { notParamFieldNamesInUse, variablesSets };
    const result = composeThingGqlVariablesForValidationByCompoundIndexes(
      thingConfig,
      values,
      blurredFieldName,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of arrays of values for GraphQL 4', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const values = {
      subject: ['patent', 'copyright', 'design'],
      section: ['info', 'services'],
      slug: 'abc',
    };
    const blurredFieldName = 'section';
    const notParamFieldNamesInUse = [
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
      'slug',
    ];
    const variablesSets = [
      [
        { subject: 'patent', section: 'info', slug: 'abc' },
        { subject: 'copyright', section: 'info', slug: 'abc' },
        { subject: 'design', section: 'info', slug: 'abc' },
        { subject: 'patent', section: 'services', slug: 'abc' },
        { subject: 'copyright', section: 'services', slug: 'abc' },
        { subject: 'design', section: 'services', slug: 'abc' },
      ],
    ];
    const expectedResult = { notParamFieldNamesInUse, variablesSets };
    const result = composeThingGqlVariablesForValidationByCompoundIndexes(
      thingConfig,
      values,
      blurredFieldName,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of arrays of values for GraphQL 5', () => {
    const thingConfig = { compoundIndexFieldSets, paramFields };
    const values = {
      subject: ['patent', 'copyright', 'design'],
      section: ['info', 'services'],
      slug: 'abc',
    };
    const blurredFieldName = 'slug2';
    const notParamFieldNamesInUse = ['slug2', 'slug2', 'slug2'];
    const variablesSets = [
      [
        { subject: 'patent', slug2: '' },
        { subject: 'copyright', slug2: '' },
        { subject: 'design', slug2: '' },
      ],
    ];
    const expectedResult = { notParamFieldNamesInUse, variablesSets };
    const result = composeThingGqlVariablesForValidationByCompoundIndexes(
      thingConfig,
      values,
      blurredFieldName,
    );
    expect(result).toEqual(expectedResult);
  });
});
