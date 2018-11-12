// функция получает объект содержащий данные для создания, удаления и обновленяи
// документов в коллекции и проводит операцию одним запросом
/*  например:
на входе (obj):
{
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
}

на выходе
[
  {
  deleteOne: {
    {
      filter: { _id: '5a8489674a7ed31f78b576fa' }
    }
  },
  {
    insertOne: {
      document: {
        title: 'індексова сторінка - дуже довга назва (design)',
        content:
          'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
        _item: '5a8489674a7ed31f78b576f3',
      }
    }
  },
  {
    updateOne: {
      filter: { _id: '5a8489674a7ed31f78b576fb' },
      update: { title: 'Hand of the King' }
    }
  },
]
*/
const composeBulkWriteArgs = ({ insert, update, remove }) => {
  const result = remove.map(_id => ({ deleteOne: { filter: { _id } } }));

  insert.reduce((prev, document) => {
    // не случай если НЕ указана дата/время создания и / или обновления
    // необходимо установить значение поля createdAt и / или updatedAt вручную
    // иначе при пакетном создании докуменментов (BulkWrite)
    // НЕ сработает автоматическое обновление поля createdAt и / или updatedAt
    // поля НЕ будут созданы, что сломает логику работы программы
    const { updatedAt: updated, createdAt: created } = document;
    const now = new Date();
    const createdAt = created || now;
    const updatedAt = updated || now;
    prev.push({
      insertOne: { document: { ...document, createdAt, updatedAt } },
    });
    return prev;
  }, result);

  update.reduce((prev, { _id, ...rest }) => {
    prev.push({ updateOne: { filter: { _id }, update: rest } });
    return prev;
  }, result);
  return result;
};

export default composeBulkWriteArgs;
