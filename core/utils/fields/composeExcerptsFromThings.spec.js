/* eslint-env jest */
import composeExcerptsFromThings from './composeExcerptsFromThings';

describe('composeExcerptsFromThings core field util', () => {
  const things = [
    {
      _id: '5a6ed665b9cc9613c0be745a',
      subject: ['trademark'],
      section: 'info',
      chapter: 'one',
      slug: 'abc',
    },
    {
      _id: '5a6ed665b9cc9613c0be745b',
      subject: ['trademark'],
      section: 'info',
      chapter: 'one',
      slug: 'xyz',
    },
    {
      _id: '5a6ed665b9cc9613c0be745c',
      subject: ['copyright'],
      section: 'info',
      chapter: 'two',
      slug: '',
    },
    {
      _id: '5a6ed665b9cc9613c0be745d',
      subject: ['trademark'],
      section: 'info',
      chapter: 'two',
      slug: '',
    },
    {
      _id: '5a6ed665b9cc9613c0be745e',
      subject: ['trademark'],
      section: 'services',
      chapter: 'three',
      slug: '',
    },
  ];

  test('should return excerpt erray for things', () => {
    const thingConfig = {
      orderedSets: [['subject', 'section']],
      paramFields: [
        {
          name: 'subject',
          multiple: true,
        },
        {
          name: 'section',
          multiple: false,
        },
      ],
    };
    const expectedResult = [
      {
        paramNames: '["section","subject"]',
        items: [
          '5a6ed665b9cc9613c0be745a',
          '5a6ed665b9cc9613c0be745b',
          '5a6ed665b9cc9613c0be745d',
        ],
        subject: 'trademark',
        section: 'info',
      },
      {
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745c'],
        subject: 'copyright',
        section: 'info',
      },
      {
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745e'],
        subject: 'trademark',
        section: 'services',
      },
    ];
    const result = composeExcerptsFromThings(things, thingConfig);
    expect(result).toEqual(expectedResult);
  });
  test('should return excerpt erray for things if 2 compoundIndexFieldSets', () => {
    const thingConfig = {
      orderedSets: [['subject', 'section'], ['subject', 'chapter']],
      paramFields: [
        {
          name: 'subject',
          multiple: true,
        },
        {
          name: 'section',
          multiple: false,
        },
      ],
    };
    const expectedResult = [
      {
        paramNames: '["section","subject"]',
        items: [
          '5a6ed665b9cc9613c0be745a',
          '5a6ed665b9cc9613c0be745b',
          '5a6ed665b9cc9613c0be745d',
        ],
        subject: 'trademark',
        section: 'info',
      },
      {
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745c'],
        subject: 'copyright',
        section: 'info',
      },
      {
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745e'],
        subject: 'trademark',
        section: 'services',
      },
      {
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745a', '5a6ed665b9cc9613c0be745b'],
        subject: 'trademark',
        chapter: 'one',
      },
      {
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745c'],
        subject: 'copyright',
        chapter: 'two',
      },
      {
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745d'],
        subject: 'trademark',
        chapter: 'two',
      },
      {
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745e'],
        subject: 'trademark',
        chapter: 'three',
      },
    ];
    const result = composeExcerptsFromThings(things, thingConfig);
    expect(result).toEqual(expectedResult);
  });
});
