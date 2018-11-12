/* eslint-env jest */

import sortItemsByParam from './sortItemsByParam';

describe('core Util sortItemsByParam', () => {
  test('should return empty array', () => {
    const items = [];
    const result = sortItemsByParam(items);
    const expectedResult = [];
    expect(result).toEqual(expectedResult);
  });
  test('should return array with one item', () => {
    const items = [{ dayOfWeek: 'среда' }];
    const paramName = 'dayOfWeek';
    const paramValues = [
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
      'воскресенье',
    ];
    const result = sortItemsByParam(items, paramName, paramValues);
    const expectedResult = [{ dayOfWeek: 'среда' }];
    expect(result).toEqual(expectedResult);
  });
  test('should return sorted items', () => {
    const items = [
      { dayOfWeek: 'вторник' },
      { dayOfWeek: 'воскресенье' },
      { dayOfWeek: 'среда' },
      { dayOfWeek: 'суббота' },
      { dayOfWeek: 'четверг' },
      { dayOfWeek: 'понедельник' },
      { dayOfWeek: 'пятница' },
    ];
    const paramName = 'dayOfWeek';
    const paramValues = [
      'понедельник',
      'вторник',
      'среда',
      'четверг',
      'пятница',
      'суббота',
      'воскресенье',
    ];
    const result = sortItemsByParam(items, paramName, paramValues);
    const expectedResult = [
      { dayOfWeek: 'понедельник' },
      { dayOfWeek: 'вторник' },
      { dayOfWeek: 'среда' },
      { dayOfWeek: 'четверг' },
      { dayOfWeek: 'пятница' },
      { dayOfWeek: 'суббота' },
      { dayOfWeek: 'воскресенье' },
    ];
    expect(result).toEqual(expectedResult);
  });
});
