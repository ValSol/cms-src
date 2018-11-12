/* eslint-env jest */

import authorizeSideNavSections from './authorizeSideNavSections';

describe('authorizeSideNavSections util', () => {
  test('should filter not autorized sections', () => {
    const sideNavSections = ['Article', 'ContentSideNavSection'];
    const result = authorizeSideNavSections(sideNavSections, null);
    const expectedResult = ['ContentSideNavSection'];
    expect(result).toEqual(expectedResult);
  });
});
