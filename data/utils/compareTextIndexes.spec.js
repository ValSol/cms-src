/* eslint-env jest */
import compareTextIndexes from './compareTextIndexes';

describe('compareTextIndexes core field util', () => {
  const thingConfig = {
    textIndexFields: [
      {
        name: 'title',
        weight: 1024,
      },
      {
        name: 'content',
        weight: 512,
      },
    ],
  };
  const textIndexesFromDb = [
    {
      _id: '5a8489674a7ed31f78b576fa',
      title: 'індексова сторінка - дуже довга назва (design)',
      content:
        'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
      _item: '5a8489674a7ed31f78b576f0',
    },
    {
      _id: '5a8489674a7ed31f78b576fb',
      title: 'індексова сторінка - дуже довга назва',
      content:
        'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс\n  тестування пошуку',
      _item: '5a8489674a7ed31f78b576f1',
    },
    {
      _id: '5a8489674a7ed31f78b576fc',
      title: 'індексова сторінка - services - дуже довга назва',
      content:
        'індекс контент українською (services)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
      _item: '5a8489674a7ed31f78b576f2',
    },
  ];
  test('should return 3 empty arrays if thing arrays are corresponding', () => {
    const textIndexesFromThings = [
      {
        title: 'індексова сторінка - дуже довга назва',
        content:
          'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс\n  тестування пошуку',
        _item: '5a8489674a7ed31f78b576f1',
      },
      {
        title: 'індексова сторінка - дуже довга назва (design)',
        content:
          'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
        _item: '5a8489674a7ed31f78b576f0',
      },
      {
        title: 'індексова сторінка - services - дуже довга назва',
        content:
          'індекс контент українською (services)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
        _item: '5a8489674a7ed31f78b576f2',
      },
    ];
    const expectedResult = { insert: [], update: [], remove: [] };
    const result = compareTextIndexes(
      textIndexesFromDb,
      textIndexesFromThings,
      thingConfig,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return field arrays if thing arrays are not corresponding', () => {
    const textIndexesFromThings = [
      {
        title: 'індексова сторінка - дуже довга назва 2',
        content:
          'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс\n  тестування пошуку',
        _item: '5a8489674a7ed31f78b576f1',
      },
      {
        title: 'індексова сторінка - дуже довга назва (design)',
        content:
          'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
        _item: '5a8489674a7ed31f78b576f3',
      },
      {
        title: 'індексова сторінка - services - дуже довга назва',
        content:
          'індекс контент українською (services)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
        _item: '5a8489674a7ed31f78b576f2',
      },
    ];
    const expectedResult = {
      insert: [
        {
          title: 'індексова сторінка - дуже довга назва (design)',
          content:
            'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
          _item: '5a8489674a7ed31f78b576f3',
        },
      ],
      update: [
        {
          _id: '5a8489674a7ed31f78b576fb',
          title: 'індексова сторінка - дуже довга назва 2',
        },
      ],
      remove: ['5a8489674a7ed31f78b576fa'],
    };
    const result = compareTextIndexes(
      textIndexesFromDb,
      textIndexesFromThings,
      thingConfig,
    );
    expect(result).toEqual(expectedResult);
  });
});
