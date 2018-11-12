/* eslint-env jest */
import isMongoId from 'validator/lib/isMongoId';

import compareThings from './compareThings';

describe('compareThings core field util', () => {
  const thingsFromDb = [
    {
      _id: '5a720e599578e32044e8a671',
      title: {
        uk: 'індексова сторінка - services - дуже довга назва',
        ru: 'индексная страница - services- очень длинный заголовок',
        en: 'index page! - services - very long title',
      },
      subject: ['patent'],
      section: 'services',
      slug: '',
    },
    {
      _id: '5a720e599578e32044e8a66d',
      title: {
        uk: 'abc - дуже довга назва',
        ru: 'abc - очень длинный заголовок',
        en: 'abc - very long title',
      },
      subject: ['patent'],
      section: 'info',
      slug: 'abc',
    },
    {
      _id: '5a720e599578e32044e8a66e',
      title: {
        uk: 'xyz - дуже довга назва (тестування пошуку)',
        ru: 'xyz - очень длинный заголовок',
        en: 'xyz - very long title',
      },
      subject: ['patent'],
      section: '"info"',
      slug: 'xyz',
    },
  ];
  test('should return 2 empty arrays if imported nothing', () => {
    const importedThings = [];
    const expectedResult = {
      insert: [],
      update: [],
      allThings: thingsFromDb,
      newAndUpdatedThings: [],
    };
    const result = compareThings(thingsFromDb, importedThings);
    expect(result).toEqual(expectedResult);
  });
  test('should return field arrays if thing arrays are not corresponding', () => {
    const importedThings = [
      {
        _id: '5a720e599578e32044e8a66d',
        title: {
          uk: 'abc - дуже довга назва plus',
          ru: 'abc - очень длинный заголовок',
        },
        subject: ['trademark'],
        slug: 'abc',
      },
      {
        title: {
          uk: 'new - дуже довга назва (тестування пошуку)',
          ru: 'new - очень длинный заголовок',
          en: 'new - very long title',
        },
        subject: ['trademark'],
        section: '"info"',
        slug: 'new',
      },
    ];
    const expectedResult = {
      update: [
        {
          _id: '5a720e599578e32044e8a66d',
          // дельта остается в "плоском виде" чтобы не передавать в БД ...
          // ... не изменяемые значения в соседних элементах
          'title.uk': 'abc - дуже довга назва plus',
          subject: ['trademark'],
        },
      ],
      insert: [
        {
          title: {
            uk: 'new - дуже довга назва (тестування пошуку)',
            ru: 'new - очень длинный заголовок',
            en: 'new - very long title',
          },
          subject: ['trademark'],
          section: '"info"',
          slug: 'new',
        },
      ],
      allThings: [
        {
          _id: '5a720e599578e32044e8a671',
          title: {
            uk: 'індексова сторінка - services - дуже довга назва',
            ru: 'индексная страница - services- очень длинный заголовок',
            en: 'index page! - services - very long title',
          },
          subject: ['patent'],
          section: 'services',
          slug: '',
        },
        // обновленная thing
        {
          _id: '5a720e599578e32044e8a66d',
          title: {
            uk: 'abc - дуже довга назва plus',
            ru: 'abc - очень длинный заголовок',
            en: 'abc - very long title',
          },
          subject: ['trademark'],
          section: 'info',
          slug: 'abc',
        },
        {
          _id: '5a720e599578e32044e8a66e',
          title: {
            uk: 'xyz - дуже довга назва (тестування пошуку)',
            ru: 'xyz - очень длинный заголовок',
            en: 'xyz - very long title',
          },
          subject: ['patent'],
          section: '"info"',
          slug: 'xyz',
        },
        // добавляемая thing
        {
          title: {
            uk: 'new - дуже довга назва (тестування пошуку)',
            ru: 'new - очень длинный заголовок',
            en: 'new - very long title',
          },
          subject: ['trademark'],
          section: '"info"',
          slug: 'new',
        },
      ],
      newAndUpdatedThings: [
        // добавляемая thing
        {
          title: {
            uk: 'new - дуже довга назва (тестування пошуку)',
            ru: 'new - очень длинный заголовок',
            en: 'new - very long title',
          },
          subject: ['trademark'],
          section: '"info"',
          slug: 'new',
        },
        // обновленная thing
        {
          _id: '5a720e599578e32044e8a66d',
          title: {
            uk: 'abc - дуже довга назва plus',
            ru: 'abc - очень длинный заголовок',
            en: 'abc - very long title',
          },
          subject: ['trademark'],
          section: 'info',
          slug: 'abc',
        },
      ],
    };
    const result = compareThings(thingsFromDb, importedThings);
    // eslint-disable-next-line no-underscore-dangle
    expect(isMongoId(result.insert[0]._id.toString())).toBe(true);
    // eslint-disable-next-line no-underscore-dangle
    expect(isMongoId(result.allThings[3]._id.toString())).toBe(true);
    // eslint-disable-next-line no-underscore-dangle
    expect(isMongoId(result.newAndUpdatedThings[0]._id.toString())).toBe(true);
    // убираем сгенерированный _id (т.к. заранее неизвестно его значение)
    delete result.insert[0]._id; // eslint-disable-line no-underscore-dangle
    delete result.allThings[3]._id; // eslint-disable-line no-underscore-dangle
    delete result.newAndUpdatedThings[0]._id; // eslint-disable-line no-underscore-dangle
    expect(result).toEqual(expectedResult);
  });
});
