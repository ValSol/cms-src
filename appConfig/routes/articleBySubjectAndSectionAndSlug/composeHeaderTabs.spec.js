/* eslint-env jest */

import composeHeaderTabs from './composeHeaderTabs';

describe('composeHeaderTabs util of article route', () => {
  const populatedExcerpts = [
    {
      _id: '59ea1b34a3029e0f44c5ed49',
      subject: 'design',
      section: 'info',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed42',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка (design)',
          },
        },
      ],
    },
    {
      _id: '59ea1b34a3029e0f44c5ed47',
      subject: 'patent',
      section: 'info',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed43',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка',
          },
        },
        {
          _id: '59ea1b33a3029e0f44c5ed40',
          slug: 'abc',
          shortTitle: {
            uk: 'abc - коротко',
          },
        },
        {
          _id: '59ea1b33a3029e0f44c5ed41',
          slug: 'xyz',
          shortTitle: {
            uk: 'xyz - коротко',
          },
        },
      ],
    },
    {
      _id: '59ea1b34a3029e0f44c5ed48',
      subject: 'patent',
      section: 'services',
      items: [
        {
          _id: '59ea1b33a3029e0f44c5ed44',
          slug: '',
          shortTitle: {
            uk: 'індексова сторінка - services',
          },
        },
      ],
    },
  ];

  test('should return headerTabs with default addresses', () => {
    const context = {
      baseUrl: '/en/design/info',
      locale: 'en',
      params: {
        slug: '',
      },
    };
    const result = composeHeaderTabs(populatedExcerpts, context);
    const expectedResult = [
      ['patent', '/en/patent/info'],
      ['design', '/en/design/info'],
    ];
    expect(result).toEqual(expectedResult);
  });

  test('should return headerTabs with current addresses', () => {
    const context = {
      baseUrl: '/patent/info/abc',
      locale: 'uk',
      params: {
        slug: '',
      },
    };
    const result = composeHeaderTabs(populatedExcerpts, context);
    const expectedResult = [
      ['patent', '/patent/info/abc'],
      ['design', '/design/info'],
    ];
    expect(result).toEqual(expectedResult);
  });
});
