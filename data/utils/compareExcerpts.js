import deepEqual from 'deep-equal';

import { coerceArrayToArray, sameItems } from '../../core/utils';

// функция получает 2 (3) массива выборок
// 1-й массив с выборками содержащими поле _id (т.е. находившимися в БД)
// 2-й массив с выборками построенными исходя из содержимого соответствующей ...
// ... коллекции things - т.е. с гарантирована ПРАВИЛЬНЫМИ наборами items
// 3-й - необязательный массив содержит ИМПОРТИРУЕМЫЕ выборки, порядок ...
// ... расположения _id в items внутри которых является ПРИОРИТЕТНЫМ
// в результате выдает объект с 3-мя списками изменений
// которые необходимо внести в БД: 1-й update: измения в существующие excerpts,
// 2-й remove: excerpts на удаление; 3-й insert: новые excerpts.
// excerptsFromDb - массив с выборками содержащими поле _id
// excerptsFromThings - массив с выборками вычисленными исходя из значений things
// excerptsFromImport - массив с выборками импортируемыми пользователем
// thingConfig - соответствующая конфигурация thing
/*  например:
на входе excerptsFromDb =
[
  {
    _id: "5a6ed67bb9cc9613c0be7461",
    paramNames: "[\"section\",\"subject\"]",
    items: [
      "5a6ed665b9cc9613c0be745d",
      "5a6ed665b9cc9613c0be745a",
      "5a6ed665b9cc9613c0be745b"
    ],
    subject: "trademark",
    section: "info"
  },
  {
    _id: "5a6ed67bb9cc9613c0be7462",
    paramNames: "[\"section\",\"subject\"]",
    items: [
      "5a6ed665b9cc9613c0be745c"
    ],
    subject: "copyright",
    section: "info"
  },
  {
    _id: "5a6ed67bb9cc9613c0be7463",
    paramNames: "[\"section\",\"subject\"]",
    items: [
      "5a6ed665b9cc9613c0be745e"
    ],
    subject: "trademark",
    section: "services"
  },
]
и excerptsFromThings =
{
  paramNames: "[\"section\",\"subject\"]",
  items: [
    "5a6ed665b9cc9613c0be745a",
    "5a6ed665b9cc9613c0be745b"
    "5a6ed665b9cc9613c0be745d",
  ],
  subject: "trademark",
  section: "info"
},
{
  paramNames: "[\"section\",\"subject\"]",
  items: [
    "5a6ed665b9cc9613c0be745c"
  ],
  subject: "copyright",
  section: "info"
},
{
  paramNames: "[\"section\",\"subject\"]",
  items: [
    "5a6ed665b9cc9613c0be745e"
  ],
  subject: "trademark",
  section: "services"
},
на выходе, т.к. содержат соответствующие наборы items ...
... возвращает пустой объект c пустыми массивами
{ update: [], remove: [], insert [] }
*/

// ВНИМАНИЕ - если в excerptsFromImport присутствуют _id ...
// их значения НЕ ИСПОЛЬЗУЮТСЯ!

// вспомогательная функция преобразует массив выборок в словарь
const excerptArrayToDict = excerptArray =>
  excerptArray.reduce((prev, excerpt) => {
    const { paramNames } = excerpt;
    const paramValues = JSON.parse(paramNames)
      .map(name => excerpt[name])
      .join(' ');
    const key = `${paramNames}:${paramValues}`;
    // eslint-disable-next-line no-param-reassign
    prev[key] = excerpt;
    return prev;
  }, {});

const compareExcerpts = (
  excerptsFromDb,
  excerptsFromThings,
  excerptsFromImport = [],
) => {
  const excerptsFromDbDict = excerptArrayToDict(excerptsFromDb);
  const excerptsFromThingsDict = excerptArrayToDict(excerptsFromThings);
  const excerptsFromImportDict = excerptArrayToDict(excerptsFromImport);
  const update = [];
  const insert = [];
  Object.keys(excerptsFromThingsDict).forEach(key => {
    // если отсутствует соответствующая выборка - добавляем ее в массив insert
    if (!excerptsFromDbDict[key]) {
      if (excerptsFromImportDict[key]) {
        const items = coerceArrayToArray(
          excerptsFromImportDict[key].items,
          excerptsFromThingsDict[key].items,
        );
        insert.push({ ...excerptsFromThingsDict[key], items });
      } else {
        insert.push(excerptsFromThingsDict[key]);
      }
    } else {
      if (
        !sameItems(
          excerptsFromDbDict[key].items,
          excerptsFromThingsDict[key].items,
          true, // coerceToString - чтобы при сравнении _id приводить к String
        ) ||
        (excerptsFromImportDict[key] &&
          !deepEqual(
            excerptsFromDbDict[key].items.map(item => item.toString()),
            excerptsFromImportDict[key].items.map(item => item.toString()),
          ))
      ) {
        // если НЕ одни и теже itmes в excerptsFromDbDict[key] и excerptsFromThingsDict[key]
        // сохраняем порядок совпадающих элементов
        let items = coerceArrayToArray(
          excerptsFromDbDict[key].items,
          excerptsFromThingsDict[key].items,
        );
        if (excerptsFromImportDict[key]) {
          // если нужно дополнительно учитывать импортируемую выборку
          // учитываем порядок элементов в импортируемой выборке
          items = coerceArrayToArray(excerptsFromImportDict[key].items, items);
        }
        update.push({
          // eslint-disable-next-line no-underscore-dangle
          _id: excerptsFromDbDict[key]._id,
          items,
        });
      }
      // удаляем из excerptsFromDbDict выборку для которой ...
      // ... найдена соответствующая выборка в excerptsFromThingsDict
      delete excerptsFromDbDict[key];
    }
  });
  const remove = Object.keys(excerptsFromDbDict).map(
    // eslint-disable-next-line no-underscore-dangle
    key => excerptsFromDbDict[key]._id,
  );
  return { insert, update, remove };
};

export default compareExcerpts;
