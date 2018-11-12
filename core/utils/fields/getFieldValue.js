//  функция получает путь к значению в многоуровневом объекте ...
// и сам объект = и возвращаем соответствующее этому пути значение в объекте
// obj - объект в котором ищется значение
// path - текстовое значение задающее путь к значению "в глубине" объекта
/*
например,
на входе
obj =  { aaa: { bbb: { ccc: 123 } } }
path = 'aaa[bbb][ccc]'
на выходе: 123
*/

const getFieldValue = (obj, path) => {
  const levels = path.split('[').map(item => item.replace(']', ''));
  const result = levels.reduce((prev, level) => {
    // eslint-disable-next-line
    prev = prev[level];
    return prev;
  }, obj);
  return result;
};

export default getFieldValue;
