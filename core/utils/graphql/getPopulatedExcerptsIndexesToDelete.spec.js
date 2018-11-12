/* eslint-env jest */

import getPopulatedExcerptsIndexesToDelete from './getPopulatedExcerptsIndexesToDelete';

describe('getPopulatedExcerptsIndexesToDelete core graphql util', () => {
  test('should return no indexes for empty populatedExcerpts array', () => {
    const populatedExcerpts = [];
    const id = '1234567890';
    const expectedResult = [];
    const result = getPopulatedExcerptsIndexesToDelete(populatedExcerpts, id);
    expect(result).toEqual(expectedResult);
  });
  test('should return no indexes for populatedExcerpts without id in question', () => {
    const populatedExcerpts = [
      { items: [{ _id: '1' }, { _id: '2' }, { _id: '3' }] },
      { items: [{ _id: '11' }, { _id: '22' }, { _id: '33' }] },
      { items: [{ _id: '111' }, { _id: '222' }, { _id: '333' }] },
    ];
    const id = '1234567890';
    const expectedResult = [];
    const result = getPopulatedExcerptsIndexesToDelete(populatedExcerpts, id);
    expect(result).toEqual(expectedResult);
  });
  test('should return indexes for populatedExcerpts', () => {
    const populatedExcerpts = [
      { items: [{ _id: '1' }, { _id: '1234567890' }, { _id: '3' }] },
      { items: [{ _id: '11' }, { _id: '22' }, { _id: '33' }] },
      { items: [{ _id: '111' }, { _id: '222' }, { _id: '1234567890' }] },
    ];
    const id = '1234567890';
    const expectedResult = [[0, 1], [2, 2]];
    const result = getPopulatedExcerptsIndexesToDelete(populatedExcerpts, id);
    expect(result).toEqual(expectedResult);
  });
});
