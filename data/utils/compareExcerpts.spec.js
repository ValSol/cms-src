/* eslint-env jest */
import compareExcerpts from './compareExcerpts';

describe('compareExcerpts core field util', () => {
  const excerptsFromDb = [
    {
      _id: '5a6ed67bb9cc9613c0be7461',
      paramNames: '["section","subject"]',
      items: [
        '5a6ed665b9cc9613c0be745d',
        '5a6ed665b9cc9613c0be745a',
        '5a6ed665b9cc9613c0be745b',
      ],
      subject: 'trademark',
      section: 'info',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7462',
      paramNames: '["section","subject"]',
      items: ['5a6ed665b9cc9613c0be745c'],
      subject: 'copyright',
      section: 'info',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7463',
      paramNames: '["section","subject"]',
      items: ['5a6ed665b9cc9613c0be745e'],
      subject: 'trademark',
      section: 'services',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7464',
      paramNames: '["chapter","subject"]',
      items: ['5a6ed665b9cc9613c0be745a', '5a6ed665b9cc9613c0be745b'],
      subject: 'trademark',
      chapter: 'one',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7465',
      paramNames: '["chapter","subject"]',
      items: ['5a6ed665b9cc9613c0be745c'],
      subject: 'copyright',
      chapter: 'two',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7466',
      paramNames: '["chapter","subject"]',
      items: ['5a6ed665b9cc9613c0be745d'],
      subject: 'trademark',
      chapter: 'two',
    },
    {
      _id: '5a6ed67bb9cc9613c0be7467',
      paramNames: '["chapter","subject"]',
      items: ['5a6ed665b9cc9613c0be745f'],
      subject: 'trademark',
      chapter: 'three',
    },
  ];
  test('should return 3 empty arrays if thing arrays are corresponding', () => {
    const excerptsFromThings = [
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
        items: ['5a6ed665b9cc9613c0be745b', '5a6ed665b9cc9613c0be745a'],
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
        items: ['5a6ed665b9cc9613c0be745f'],
        subject: 'trademark',
        chapter: 'three',
      },
    ];
    const expectedResult = { insert: [], update: [], remove: [] };
    const result = compareExcerpts(excerptsFromDb, excerptsFromThings);
    expect(result).toEqual(expectedResult);
  });
  test('should return field arrays without excerptsFromImport', () => {
    const excerptsFromThings = [
      {
        // соответствует выборке из DB (_id = '5a6ed67bb9cc9613c0be7461') ...
        // ... только порядок items другой
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
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7462') ...
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745c'],
        subject: 'copyright',
        section: 'info',
      },
      {
        // отсутствует в DB
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745e'],
        subject: 'copyright',
        section: 'services',
      },
      {
        // соответствует выборке из DB (_id = '5a6ed67bb9cc9613c0be7464') ...
        // ... только в items'ах на 1 _id больше
        paramNames: '["chapter","subject"]',
        items: [
          '5a6ed665b9cc9613c0be745c',
          '5a6ed665b9cc9613c0be745b',
          '5a6ed665b9cc9613c0be745a',
        ],
        subject: 'trademark',
        chapter: 'one',
      },
      {
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7466') ...
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745d'],
        subject: 'trademark',
        chapter: 'two',
      },
      {
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7467') ...
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745f'],
        subject: 'trademark',
        chapter: 'three',
      },
    ];
    const expectedResult = {
      insert: [
        {
          paramNames: '["section","subject"]',
          items: ['5a6ed665b9cc9613c0be745e'],
          subject: 'copyright',
          section: 'services',
        },
      ],
      update: [
        {
          _id: '5a6ed67bb9cc9613c0be7464',
          items: [
            '5a6ed665b9cc9613c0be745a',
            '5a6ed665b9cc9613c0be745b',
            '5a6ed665b9cc9613c0be745c',
          ],
        },
      ],
      remove: ['5a6ed67bb9cc9613c0be7463', '5a6ed67bb9cc9613c0be7465'],
    };
    const result = compareExcerpts(excerptsFromDb, excerptsFromThings);
    expect(result).toEqual(expectedResult);
  });
  test('should return field arrays with excerptsFromImport', () => {
    const excerptsFromThings = [
      {
        // соответствует выборке из DB (_id = '5a6ed67bb9cc9613c0be7461') ...
        // ... только порядок items другой
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
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7462') ...
        paramNames: '["section","subject"]',
        items: ['5a6ed665b9cc9613c0be745c'],
        subject: 'copyright',
        section: 'info',
      },
      {
        // отсутствует в DB
        paramNames: '["section","subject"]',
        items: [
          '5a6ed665b9cc9613c0be7450',
          '5a6ed665b9cc9613c0be7451',
          '5a6ed665b9cc9613c0be7452',
        ],
        subject: 'copyright',
        section: 'services',
      },
      {
        // соответствует выборке из DB (_id = '5a6ed67bb9cc9613c0be7464') ...
        // ... только в items'ах на 1 _id больше
        paramNames: '["chapter","subject"]',
        items: [
          '5a6ed665b9cc9613c0be745c',
          '5a6ed665b9cc9613c0be745b',
          '5a6ed665b9cc9613c0be745a',
        ],
        subject: 'trademark',
        chapter: 'one',
      },
      {
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7466') ...
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745d'],
        subject: 'trademark',
        chapter: 'two',
      },
      {
        // совпадает с выборкой из DB (_id = '5a6ed67bb9cc9613c0be7467') ...
        paramNames: '["chapter","subject"]',
        items: ['5a6ed665b9cc9613c0be745f'],
        subject: 'trademark',
        chapter: 'three',
      },
    ];

    const excerptsFromImport = [
      {
        // соответствует выборке из things и из DB (_id = '5a6ed67bb9cc9613c0be7461') ...
        // ... только порядок items другой
        paramNames: '["section","subject"]',
        items: [
          '5a6ed665b9cc9613c0be745a',
          '5a6ed665b9cc9613c0be745d',
          '5a6ed665b9cc9613c0be745b',
        ],
        subject: 'trademark',
        section: 'info',
      },
      {
        // отсутствует в DB, но присутствует в выборке из things в другом порядке
        paramNames: '["section","subject"]',
        items: [
          '5a6ed665b9cc9613c0be7451',
          '5a6ed665b9cc9613c0be7452',
          '5a6ed665b9cc9613c0be7450',
        ],
        subject: 'copyright',
        section: 'services',
      },
    ];

    const expectedResult = {
      insert: [
        {
          paramNames: '["section","subject"]',
          items: [
            '5a6ed665b9cc9613c0be7451',
            '5a6ed665b9cc9613c0be7452',
            '5a6ed665b9cc9613c0be7450',
          ],
          subject: 'copyright',
          section: 'services',
        },
      ],
      update: [
        {
          _id: '5a6ed67bb9cc9613c0be7461',
          items: [
            '5a6ed665b9cc9613c0be745a',
            '5a6ed665b9cc9613c0be745d',
            '5a6ed665b9cc9613c0be745b',
          ],
        },
        {
          _id: '5a6ed67bb9cc9613c0be7464',
          items: [
            '5a6ed665b9cc9613c0be745a',
            '5a6ed665b9cc9613c0be745b',
            '5a6ed665b9cc9613c0be745c',
          ],
        },
      ],
      remove: ['5a6ed67bb9cc9613c0be7463', '5a6ed67bb9cc9613c0be7465'],
    };
    const result = compareExcerpts(
      excerptsFromDb,
      excerptsFromThings,
      excerptsFromImport,
    );
    expect(result).toEqual(expectedResult);
  });
});
