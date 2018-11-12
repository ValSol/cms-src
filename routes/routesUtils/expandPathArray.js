// вспомогательная функция разбирающая массив
// который является одной (очередной) строкой в массиве массивов
// генерируемого функцией makePathsArrays
// и возвращает 1) если исходый массив содержит параметры
// (строки с двоеточием в начале) возвращает массив массивов
// содержащий сгенерированные строки на основании значений параметров
// 2) если исходый массив НЕ содержит параметры возвращает
// просто массив содрежащий исходные массив
/*
пример 1:
на входе pathArray = [':subject', ':section']
при этом params = { subject: ['tm', 'patent', 'design'], section: ['info', 'services']}
в результате входящая строка разворачивается в массив строк (массив массивов)
[
  ['tm', 'info'],
  ['tm', 'services'],
  ['patent', 'info'],
  ['patent', 'services'],
  ['design', 'info'],
  ['design', 'services'],
]
пример 2 (во входная строка не содержит параметров):
на входе pathArray = ['admin', 'articles']
при этом params = undefined (значение этого параметра все равно не используется)
в результате на выходе массив массивов с входным массивом
в качестве единственного элемента: [['admin', 'articles']]
*/

const expandPathArray = (pathArray, params) => {
  // если отсутствуют сегменты начинающиеся с двоеточия (":")
  // возвращаем исходный массив
  if (!pathArray.filter(seg => seg.indexOf(':') === 0).length) {
    return [pathArray];
  }

  // если отсутствуют параметры по которым следует разбирать строки параметра
  // возбуждаем ошибку
  if (!params || !Object.keys(params).length) {
    throw new TypeError('Empty params object!');
  }

  // собираем развернутый вариант массива в новый массив
  const newPathsArrays = [[]];
  pathArray.forEach(seg => {
    // если сегмент пути не задает парамет просто вставляем его значение
    // во все уже сформированные массивы задающие отдельные пути
    if (seg.indexOf(':') !== 0) {
      newPathsArrays.forEach(array => array.push(seg));
    } else {
      // убираем двоеточие (":") в начале названия параметра
      const paramName = seg.slice(1);
      const paramCount = params[paramName].length;
      const arraysCount = newPathsArrays.length;
      // умножаем количество какждой строки в массиве-массивов в paramCount раз
      if (paramCount > 1) {
        // будем перебирать текущий массив массивов с последних строк к первым
        // чтобы умножение (добавляение) новых строк НЕ приводило к сдвигу
        // в нумерации строки которая умножается
        for (let i = arraysCount - 1; i >= 0; i -= 1) {
          for (let j = 1; j < paramCount; j += 1) {
            // вставляем дубликат строки
            newPathsArrays.splice(i, 0, newPathsArrays[i].slice());
          }
        }
      }
      // добавляем все значения очередного параметра в соответствующие строки
      let k = 0;
      for (let i = 0; i < arraysCount; i += 1) {
        // eslint-disable-next-line no-loop-func
        params[paramName].forEach(paramValue => {
          newPathsArrays[k].push(paramValue);
          k += 1;
        });
      }
    }
  });
  return newPathsArrays;
};

export default expandPathArray;
