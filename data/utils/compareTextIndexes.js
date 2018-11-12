// функция получает 2 массива
// 1-й массив с текстовыми индексами, содержащими поле _id (т.е. находящиеся в БД)
// 2-й массив с текстовыми индексами, построенными исходя из содержимого соответствующей ...
// ... коллекции things - т.е. с гарантирована текстовыми индексами
// и исходя из конфиграции thing выдает объект с 3-мя списками изменений
// которые необходимо внести в БД: 1-й update: измения в существующие text indexes,
// 2-й remove: text indexes на удаления; 3-й insert: text indexes.
// textIndexesFromDb - массив с текстовыми индексами содержащими поле _id
// textIndexesFromThings - массив с текстовыми индексами вычисленными исходя из значений things
// thingConfig - соответствующая конфигурация thing
/*  например:
на входе textIndexesFromDb =
[
  {
    _id: '5a8489674a7ed31f78b576fa',
    title: 'індексова сторінка - дуже довга назва (design)',
    content: 'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
    _item: '5a8489674a7ed31f78b576f0',
  },
  {
    _id: '5a8489674a7ed31f78b576fb',
    title: 'індексова сторінка - дуже довга назва',
    content: 'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс\n  тестування пошуку',
    _item: '5a8489674a7ed31f78b576f1',
  },
  {
    _id: '5a8489674a7ed31f78b576fc',
    title: 'індексова сторінка - services - дуже довга назва',
    content: 'індекс контент українською (services)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
    _item: '5a8489674a7ed31f78b576f2',
  },
]
и textIndexesFromThings =
[
  {
    title: 'індексова сторінка - дуже довга назва (design)',
    content: 'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
    _item: '5a8489674a7ed31f78b576f0',
  },
  {
    title: 'індексова сторінка - дуже довга назва',
    content: 'індекс контент українською (design)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс\n  тестування пошуку',
    _item: '5a8489674a7ed31f78b576f1',
  },
  {
    title: 'індексова сторінка - services - дуже довга назва',
    content: 'індекс контент українською (services)    \nперший пунк індекс\nдругий пункт індекс\nтретій пункт індекс',
    _item: '5a8489674a7ed31f78b576f2',
  },
]

на выходе, т.к. содержат соответствующие наборы items ...
... возвращает пустой объект c пустыми массивами
{ update: [], remove: [], insert [] }
*/

// вспомогательная функция преобразует массив текстовых индексов в словарь
const textIndexArrayToDict = textIndexArray =>
  textIndexArray.reduce((prev, textIndex) => {
    const { _item } = textIndex;
    // eslint-disable-next-line no-param-reassign
    prev[_item.toString()] = textIndex;
    return prev;
  }, {});

const compareTextIndexes = (
  textIndexesFromDb,
  textIndexesFromThings,
  thingConfig,
) => {
  const textIndexesFromDbDict = textIndexArrayToDict(textIndexesFromDb);
  const textIndexesFromThingsDict = textIndexArrayToDict(textIndexesFromThings);
  const update = [];
  const insert = [];
  const { textIndexFields } = thingConfig;
  Object.keys(textIndexesFromThingsDict).forEach(key => {
    // если отсутствует соответствующая выборка - добавляем ее в массив insert
    if (!textIndexesFromDbDict[key]) {
      insert.push(textIndexesFromThingsDict[key]);
    } else {
      if (
        !textIndexFields.every(
          ({ name }) =>
            textIndexesFromDbDict[key][name] ===
            textIndexesFromThingsDict[key][name],
        )
      ) {
        // если НЕ совпадает какое либо из индексируемых полей
        // eslint-disable-next-line no-underscore-dangle
        const obj = { _id: textIndexesFromDbDict[key]._id };
        textIndexFields.forEach(({ name }) => {
          if (
            textIndexesFromDbDict[key][name] !==
            textIndexesFromThingsDict[key][name]
          ) {
            obj[name] = textIndexesFromThingsDict[key][name];
          }
        });
        update.push(obj);
      }
      // удаляем из textIndexesFromDbDict текстовый индекс для которой ...
      // ... найдена соответствующая выборка в textIndexesFromThingsDict
      delete textIndexesFromDbDict[key];
    }
  });
  const remove = Object.keys(textIndexesFromDbDict).map(
    // eslint-disable-next-line no-underscore-dangle
    key => textIndexesFromDbDict[key]._id,
  );
  return { insert, update, remove };
};

export default compareTextIndexes;
