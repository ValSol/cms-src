/* eslint-env jest */

import rbac from './index';

describe('core utils', () => {
  describe('rbac', () => {
    test('should return true for admin user', () => {
      const operation = 'Article:add';
      const user = { email: 'example@example.com', role: 'admin' };
      const result = rbac.can(operation, { user });
      expect(result).toBeTruthy();
    });
    test('should return false for guest user', () => {
      const operation = 'Article:add';
      const user = null;
      const result = rbac.can(operation, { user });
      expect(result).toBeFalsy();
    });
  });
});
