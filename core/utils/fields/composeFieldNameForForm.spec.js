/* eslint-env jest */
import composeFieldNameForForm from './composeFieldNameForForm';

describe('composeFieldNameForForm', () => {
  const name = 'title';
  test('should sompose fieldName with no predecessors', () => {
    const predecessors = [];
    const expectedResult = name;
    const result = composeFieldNameForForm(name, predecessors);
    expect(result).toEqual(expectedResult);
  });
  test('should sompose fieldName with one predecessor', () => {
    const predecessors = ['comment'];
    const expectedResult = 'comment[title]';
    const result = composeFieldNameForForm(name, predecessors);
    expect(result).toEqual(expectedResult);
  });
  test('should sompose fieldName with several predecessors', () => {
    const predecessors = ['device', 'comments', '3'];
    const expectedResult = 'device[comments][3][title]';
    const result = composeFieldNameForForm(name, predecessors);
    expect(result).toEqual(expectedResult);
  });
});
