/* eslint-env jest */

import composeExcerptFields from './composeExcerptFields';

describe('composeExcerptFields util', () => {
  const paramFields = [
    {
      name: 'subject',
      multiple: true,
      required: true,
    },
    {
      name: 'section',
      multiple: false,
      required: true,
    },
    {
      name: 'genre',
      multiple: true,
      required: true,
    },
  ];
  const orderedSets = [
    [],
    ['subject'],
    ['section'],
    ['subject', 'section'],
    ['subject', 'section', 'genre'],
  ];

  const thingConfig = { orderedSets, paramFields };
  const paramFields2 = [
    {
      name: 'subject',
      multiple: false,
      required: true,
    },
    {
      name: 'section',
      multiple: false,
      required: true,
    },
    {
      name: 'genre',
      multiple: false,
      required: true,
    },
  ];
  const thingConfig2 = { orderedSets, paramFields: paramFields2 };
  test('should return array of results for only scalar params', () => {
    const thing = {
      subject: 'patent',
      section: 'info',
      genre: 'report',
    };
    const expectedResult = [
      { paramNames: JSON.stringify([]) },
      { paramNames: JSON.stringify(['subject']), subject: 'patent' },
      { paramNames: JSON.stringify(['section']), section: 'info' },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'patent',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'report',
      },
    ];
    const result = composeExcerptFields(thingConfig2, thing);
    expect(result).toEqual(expectedResult);
  });
  test('should return array of results for the simplest thing with array params', () => {
    const thing = {
      subject: ['patent'],
      section: 'info',
      genre: ['report'],
    };
    const expectedResult = [
      { paramNames: JSON.stringify([]) },
      { paramNames: JSON.stringify(['subject']), subject: 'patent' },
      { paramNames: JSON.stringify(['section']), section: 'info' },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'patent',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'report',
      },
    ];
    const result = composeExcerptFields(thingConfig, thing);
    expect(result).toEqual(expectedResult);
  });
  test('should return array of results for the simplest thing with array params', () => {
    const thing = {
      subject: ['patent', 'trademark', 'copyright'],
      section: 'info',
      genre: ['report', 'interview'],
    };
    const expectedResult = [
      { paramNames: JSON.stringify([]) },
      { paramNames: JSON.stringify(['subject']), subject: 'patent' },
      { paramNames: JSON.stringify(['subject']), subject: 'trademark' },
      { paramNames: JSON.stringify(['subject']), subject: 'copyright' },
      { paramNames: JSON.stringify(['section']), section: 'info' },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'patent',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'trademark',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'copyright',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'interview',
      },
    ];
    const result = composeExcerptFields(thingConfig, thing);
    expect(result).toEqual(expectedResult);
  });
});
