import decomposeMultipleParameters from './decomposeMultipleParameters';
// функция получает массив полей things и возвращает упорядоченные выборки
// исходя из конфиграции thing
// things - массив things
// thingConfig - конфигурация обрабатываемых things
/*  например:
на входе (things):
[
  {
    _id: '5a6ed665b9cc9613c0be745a',
    subject: ['trademark'],
    section: 'info',
    slug: 'abc',
  },
  {
    _id: '5a6ed665b9cc9613c0be745b',
    subject: ['trademark'],
    section: 'info',
    slug: 'xyz',
  },
  {
    _id: '5a6ed665b9cc9613c0be745c',
    subject: ['copyright'],
    section: 'info',
    slug: '',
  },
  {
    _id: '5a6ed665b9cc9613c0be745d',
    subject: ['trademark'],
    section: 'info',
    slug: '',
  },
  {
    _id: '5a6ed665b9cc9613c0be745e',
    subject: ['trademark'],
    section: 'services',
    slug: '',
  }
]
на выходе (excerpts)
[
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
]
*/
const composeExcerptsFromThings = (originalThings, thingConfig) => {
  const { orderedSets } = thingConfig;

  // разворачиваем (размножаем) things с multiple параметрами
  // к примерму 1 thing c трем значенями в multiple параметре subject
  // заменяется на 3 thing с соответствующими текстовыми значениями subject
  const things = decomposeMultipleParameters(thingConfig, originalThings);

  const excerptDict = {};
  orderedSets.forEach(set => {
    const paramNames = JSON.stringify(set.slice().sort());
    things.forEach(thing => {
      // формируем массив значений параметров для текущего thing
      // например: ['subject', 'section'] => ['patent', 'info'];
      const paramValues = set.map(name => thing[name]).join(' ');
      const key = `${paramNames}:${paramValues}`;
      if (!excerptDict[key]) {
        // если текущая комбинация параметров встретилась впервые ...
        // ... добавляем в словарь excerptDict соответствующий новый объект
        excerptDict[key] = { paramNames, items: [] };
        set.reduce((prev, name) => {
          // eslint-disable-next-line no-param-reassign
          prev[name] = thing[name];
          return prev;
        }, excerptDict[key]);
      }
      // eslint-disable-next-line no-underscore-dangle
      excerptDict[key].items.push(thing._id);
    });
  });
  return Object.keys(excerptDict).map(key => excerptDict[key]);
};

export default composeExcerptsFromThings;
