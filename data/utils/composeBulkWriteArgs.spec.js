/* eslint-env jest */
import composeBulkWriteArgs from './composeBulkWriteArgs';

describe('composeBulkWriteArgs core field util', () => {
  test('should return excerpt erray for things', () => {
    const obj = {
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
    const expectedResult = [
      {
        deleteOne: {
          filter: { _id: '5a8489674a7ed31f78b576fa' },
        },
      },
      {
        insertOne: {
          document: {
            title: 'індексова сторінка - дуже довга назва (design)',
            content:
              'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
            _item: '5a8489674a7ed31f78b576f3',
          },
        },
      },
      {
        updateOne: {
          filter: { _id: '5a8489674a7ed31f78b576fb' },
          update: { title: 'індексова сторінка - дуже довга назва 2' },
        },
      },
    ];
    const result = composeBulkWriteArgs(obj);
    // убеждаемся что служебные поля созданы
    expect(result[1].insertOne.document.createdAt).toBeDefined();
    expect(result[1].insertOne.document.updatedAt).toBeDefined();
    // и удаляем их чтобы не мешали сравнению остальных данных
    delete result[1].insertOne.document.createdAt;
    delete result[1].insertOne.document.updatedAt;
    expect(result).toEqual(expectedResult);
  });
});
