/* eslint-env jest */

import sortItems from './sortItems';

describe('core Util sortItems', () => {
  const items = [
    { dayOfWeek: 'понедельник', name: 'Петр', surname: 'Петров' },
    { dayOfWeek: 'пятница', name: 'Федор', surname: 'Сидоров' },
    { dayOfWeek: 'вторник', name: 'Вася', surname: 'Петров' },
    { dayOfWeek: 'четверг', name: 'Виктор', surname: 'Сидоров' },
    { dayOfWeek: 'суббота', name: 'Игорь', surname: 'Иванов' },
    { dayOfWeek: 'среда', name: 'Антон', surname: 'Иванов' },
    { dayOfWeek: 'воскресенье', name: 'Яков', surname: 'Иванов' },
  ];
  const items2 = [
    { score: 2 },
    { score: 22 },
    { score: 222 },
    { score: 7 },
    { score: 77 },
    { score: 777 },
    { score: 5 },
    { score: 55 },
    { score: 555 },
  ];
  const params = {
    dayOfWeek: [
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
      'воскресенье',
    ],
  };
  test('should return empty array', () => {
    const itemsEmpty = [];
    const result = sortItems(itemsEmpty);
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });
  test('should return sorted by one key', () => {
    const sortTemplate = ['name'];
    const result = sortItems(items, sortTemplate);
    const expectedResult = [
      { dayOfWeek: 'среда', name: 'Антон', surname: 'Иванов' },
      { dayOfWeek: 'вторник', name: 'Вася', surname: 'Петров' },
      { dayOfWeek: 'четверг', name: 'Виктор', surname: 'Сидоров' },
      { dayOfWeek: 'суббота', name: 'Игорь', surname: 'Иванов' },
      { dayOfWeek: 'понедельник', name: 'Петр', surname: 'Петров' },
      { dayOfWeek: 'пятница', name: 'Федор', surname: 'Сидоров' },
      { dayOfWeek: 'воскресенье', name: 'Яков', surname: 'Иванов' },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return sorted by two keys', () => {
    const sortTemplate = ['surname', '-name'];
    const result = sortItems(items, sortTemplate);
    const expectedResult = [
      { dayOfWeek: 'воскресенье', name: 'Яков', surname: 'Иванов' },
      { dayOfWeek: 'суббота', name: 'Игорь', surname: 'Иванов' },
      { dayOfWeek: 'среда', name: 'Антон', surname: 'Иванов' },
      { dayOfWeek: 'понедельник', name: 'Петр', surname: 'Петров' },
      { dayOfWeek: 'вторник', name: 'Вася', surname: 'Петров' },
      { dayOfWeek: 'пятница', name: 'Федор', surname: 'Сидоров' },
      { dayOfWeek: 'четверг', name: 'Виктор', surname: 'Сидоров' },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return sorted by one number key', () => {
    const sortTemplate = ['score'];
    const result = sortItems(items2, sortTemplate);
    const expectedResult = [
      { score: 2 },
      { score: 5 },
      { score: 7 },
      { score: 22 },
      { score: 55 },
      { score: 77 },
      { score: 222 },
      { score: 555 },
      { score: 777 },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return reverse sorted by one number key', () => {
    const sortTemplate = ['-score'];
    const result = sortItems(items2, sortTemplate);
    const expectedResult = [
      { score: 777 },
      { score: 555 },
      { score: 222 },
      { score: 77 },
      { score: 55 },
      { score: 22 },
      { score: 7 },
      { score: 5 },
      { score: 2 },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return reverse sorted by dayOfWeek param', () => {
    const sortTemplate = [':dayOfWeek'];
    const result = sortItems(items, sortTemplate, params);
    const expectedResult = [
      { dayOfWeek: 'понедельник', name: 'Петр', surname: 'Петров' },
      { dayOfWeek: 'вторник', name: 'Вася', surname: 'Петров' },
      { dayOfWeek: 'среда', name: 'Антон', surname: 'Иванов' },
      { dayOfWeek: 'четверг', name: 'Виктор', surname: 'Сидоров' },
      { dayOfWeek: 'пятница', name: 'Федор', surname: 'Сидоров' },
      { dayOfWeek: 'суббота', name: 'Игорь', surname: 'Иванов' },
      { dayOfWeek: 'воскресенье', name: 'Яков', surname: 'Иванов' },
    ];
    expect(result).toEqual(expectedResult);
  });
  test('should return sorted by dayOfWeek param', () => {
    const sortTemplate = ['-:dayOfWeek'];
    const result = sortItems(items, sortTemplate, params);
    const expectedResult = [
      { dayOfWeek: 'воскресенье', name: 'Яков', surname: 'Иванов' },
      { dayOfWeek: 'суббота', name: 'Игорь', surname: 'Иванов' },
      { dayOfWeek: 'пятница', name: 'Федор', surname: 'Сидоров' },
      { dayOfWeek: 'четверг', name: 'Виктор', surname: 'Сидоров' },
      { dayOfWeek: 'среда', name: 'Антон', surname: 'Иванов' },
      { dayOfWeek: 'вторник', name: 'Вася', surname: 'Петров' },
      { dayOfWeek: 'понедельник', name: 'Петр', surname: 'Петров' },
    ];
    expect(result).toEqual(expectedResult);
  });
});
