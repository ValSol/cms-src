/* eslint-env jest */

import getInitialLayout from './getInitialLayout';

describe('getInitialLayout of MultiLingualRichTextEditor component', () => {
  const expectedResult1 = {
    ukLayout: {
      x: 0,
      y: 0,
      w: 12,
      h: 1,
    },
    ruLayout: {
      x: 0,
      y: 1,
      w: 12,
      h: 1,
    },
    enLayout: {
      x: 0,
      y: 2,
      w: 12,
      h: 1,
    },
  };
  const expectedResult2 = {
    ukLayout: {
      x: 0,
      y: 0,
      w: 6,
      h: 1,
    },
    ruLayout: {
      x: 6,
      y: 0,
      w: 6,
      h: 1,
    },
    enLayout: {
      x: 0,
      y: 1,
      w: 6,
      h: 1,
    },
  };
  const expectedResult3 = {
    ukLayout: {
      x: 0,
      y: 0,
      w: 4,
      h: 1,
    },
    ruLayout: {
      x: 4,
      y: 0,
      w: 4,
      h: 1,
    },
    enLayout: {
      x: 8,
      y: 0,
      w: 4,
      h: 1,
    },
  };
  test('should return initial layout for "extraSmall" mediaType', () => {
    const result = getInitialLayout('extraSmall');
    expect(result).toEqual(expectedResult1);
  });
  test('should return initial layout for "small" mediaType', () => {
    const result = getInitialLayout('small');
    expect(result).toEqual(expectedResult1);
  });
  test('should return initial layout for "medium" mediaType', () => {
    const result = getInitialLayout('medium');
    expect(result).toEqual(expectedResult1);
  });
  test('should return initial layout for "large" mediaType', () => {
    const result = getInitialLayout('large');
    expect(result).toEqual(expectedResult2);
  });
  test('should return initial layout for "extraLarge" mediaType', () => {
    const result = getInitialLayout('extraLarge');
    expect(result).toEqual(expectedResult2);
  });
  test('should return initial layout for "infinity" mediaType', () => {
    const result = getInitialLayout('infinity');
    expect(result).toEqual(expectedResult3);
  });
});
