import flat, { unflatten } from 'flat';
import deepEqual from 'deep-equal';
import { ObjectId } from 'mongodb'; // or ObjectID

// функция получает 2 массива
// 1-й массив со всеми данными по thing из базы данных
// 2-й массив с импортируемыми данными по thing
// ... коллекции things - т.е. с гарантирована текстовыми индексами
// и исходя из конфиграции thing выдает объект с 2-мя списками изменений
// которые необходимо внести в БД: 1-й update: измения в существующий things,
// 2-й insert: документы things которые должны быть добавлены.
// и списока allThings - получаемого в результате изменений результируещего набора things
// thingsFromDb - массив с полным набором данных, в т.ч. обязательное поле _id
// importedThings - массив с текстовыми индексами которые необходимо ...
// ... импортировать в (слить с) данными в БД
/*  например:
на входе thingsFromDb =
[
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
]
и importedThings =
[
  {
    _id: '5a720e599578e32044e8a66d',
    title: {
      uk: 'abc - дуже довга назва plus',
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
]

на выходе, т.к. содержат соответствующие наборы items ...
... возвращает объект c массивами
{
  update: [
    {
      _id: '5a720e599578e32044e8a66d',
      title: {
        uk: 'abc - дуже довга назва plus',
        ru: 'abc - очень длинный заголовок',
        en: 'abc - very long title',
      },
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
}
*/

// вспомогательная функция преобразует массив текстовых индексов в словарь
const thingArrayToDict = thingArray =>
  thingArray.reduce((prev, thing) => {
    const { _id } = thing;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    if (_id) prev[_id] = thing;
    return prev;
  }, {});

const compareThings = (thingsFromDb, importedThings) => {
  const thingsFromDbDict = thingArrayToDict(thingsFromDb);
  const importedThingsDict = thingArrayToDict(importedThings);
  // 1) получаем значения атрибутов update и insert
  const update = [];
  const insert = [];
  importedThings.forEach(thing => {
    // eslint-disable-next-line no-underscore-dangle
    const { _id } = thing;
    // eslint-disable-next-line no-underscore-dangle
    if (!_id || !thingsFromDbDict[_id]) {
      // если данные документа НЕ предназначены для слияния ...
      // ... с уже существующим документом добавляем в список insert
      if (!_id) {
        // если при импорте не указан _id, генерируем здесь приводим к строке ...
        // ... чтобы не было проблем со: сравнениями / flat / unflatten
        const id = ObjectId().toString();
        const thing2 = { ...thing, _id: id };
        insert.push(thing2);
        importedThingsDict[id] = thing2;
      } else {
        insert.push(thing);
      }
    } else {
      // в противном случае добавляем в список update
      // ... с уже существующим документом добавляем в список insert
      // превращаем объекты задающие thing в плоские чтобы стало возможным ...
      // ... определять что требует обновления
      // safe: true - запрещает преобразовывание массивов
      const flatThing = flat(thing, { safe: true });
      // eslint-disable-next-line no-underscore-dangle
      const flatThingFromDb = flat(thingsFromDbDict[_id], { safe: true });
      const flatDelta = Object.keys(flatThingFromDb).reduce(
        (prev, key) => {
          if (
            flatThing[key] !== undefined &&
            !deepEqual(flatThing[key], flatThingFromDb[key])
          ) {
            // eslint-disable-next-line no-param-reassign
            prev[key] = flatThing[key];
          }
          return prev;
        },
        { _id },
      );
      // дельта остается в "плоском виде" чтобы не передавать в БД ...
      // ... не изменяемые значения в соседних элементах
      // например, передается { 'title.uk': 'заголовок plus' } чтобы НЕ передавать
      // { title: { uk: 'заголовок plus', ru: 'заголовок', en: 'title' } }
      update.push(flatDelta);
    }
  });
  // 2) получаем значение атрибутов allThings и newAndUpdatedThings
  const allThings = [];
  const updatedThings = [];
  thingsFromDb.forEach(thing => {
    const { _id } = thing;
    // eslint-disable-next-line no-underscore-dangle
    if (!importedThingsDict[_id]) {
      // если изменения по данному элементу НЕ импортируются, добавляем ...
      // ... существующий thing
      allThings.push(thing);
    } else {
      // если изменения по данному элементу импортируются, создаем обновленные элемент
      // с внесенными изменениями
      const flatThing = flat(thing, { safe: true });
      // eslint-disable-next-line no-underscore-dangle
      const flatImportedThing = flat(importedThingsDict[_id], { safe: true });
      Object.keys(flatThing).forEach(key => {
        if (
          flatImportedThing[key] !== undefined &&
          !deepEqual(flatThing[key], flatImportedThing[key])
        ) {
          // если в importedThing есть что изменять вносим изменения
          // eslint-disable-next-line no-param-reassign
          flatThing[key] = flatImportedThing[key];
        }
      });
      const unflattenThing = unflatten(flatThing);
      allThings.push(unflattenThing);
      updatedThings.push(unflattenThing);
    }
  });

  return {
    insert,
    update,
    allThings: allThings.concat(insert),
    newAndUpdatedThings: insert.concat(updatedThings),
  };
};

export default compareThings;
