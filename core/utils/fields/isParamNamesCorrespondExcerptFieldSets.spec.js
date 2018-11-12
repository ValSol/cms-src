/* eslint-env jest */
import isParamNamesCorrespondExcerptFieldSets from './isParamNamesCorrespondExcerptFieldSets';

describe('isParamNamesCorrespondExcerptFieldSets core util', () => {
  const thingConfig = { orderedSets: [['subject', 'section']] };
  test('should return true for correct paramNames', () => {
    const paramNames = JSON.stringify(['subject', 'section'].slice().sort());
    const result = isParamNamesCorrespondExcerptFieldSets(
      thingConfig,
      paramNames,
    );
    expect(result).toBeTruthy();
  });
  test('should return false for incorrect paramNames', () => {
    const paramNames = JSON.stringify(['subject', 'section']);
    const result = isParamNamesCorrespondExcerptFieldSets(
      thingConfig,
      paramNames,
    );
    expect(result).toBeFalsy();
  });
});
