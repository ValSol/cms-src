/* eslint-env jest */
import { convertFromRaw } from 'draft-js';

import decorator from './composeEmptyContentState';
import getAllEntities from './getAllEntities';

describe('getAllEntities core draft util', () => {
  const rawContent = {
    decorator,
    blocks: [
      {
        entityRanges: [{ offset: 8, length: 10, key: 0 }],
        key: 'line0',
        text: 'This is first link for test',
        type: 'unstyled',
      },
      {
        entityRanges: [],
        key: 'line1',
        text: 'Text without link',
        type: 'unstyled',
      },
      {
        entityRanges: [
          { offset: 8, length: 11, key: 1 },
          { offset: 33, length: 16, key: 0 },
        ],
        key: 'line2',
        text: 'This is second link. And this is first link again.',
        type: 'unstyled',
      },
    ],
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: '/first/link' },
      },
      1: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: '/second/link' },
      },
    },
  };

  test('should return all LINK entities', () => {
    const contentState = convertFromRaw(rawContent);
    const result = getAllEntities(contentState, 'LINK');
    expect(result).toHaveLength(3);
    // entityKey - не проверяем так как пересчитываются в новые значения
    // 0
    expect(result[0].blockKey).toEqual('line0');
    expect(result[0].start).toEqual(8);
    expect(result[0].end).toEqual(18);
    // 1
    expect(result[1].blockKey).toEqual('line2');
    expect(result[1].start).toEqual(8);
    expect(result[1].end).toEqual(19);
    // 2
    expect(result[2].blockKey).toEqual('line2');
    expect(result[2].start).toEqual(33);
    expect(result[2].end).toEqual(49);
  });

  test('should return all entities', () => {
    const contentState = convertFromRaw(rawContent);
    const result = getAllEntities(contentState);
    expect(result).toHaveLength(3);
    // 0
    expect(result[0].blockKey).toEqual('line0');
    expect(result[0].start).toEqual(8);
    expect(result[0].end).toEqual(18);
    // 1
    expect(result[1].blockKey).toEqual('line2');
    expect(result[1].start).toEqual(8);
    expect(result[1].end).toEqual(19);
    // 2
    expect(result[2].blockKey).toEqual('line2');
    expect(result[2].start).toEqual(33);
    expect(result[2].end).toEqual(49);
  });
});
