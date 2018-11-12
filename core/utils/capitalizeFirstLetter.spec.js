/* eslint-env jest */

import capitalizeFirstLetter from './capitalizeFirstLetter';

describe('capitalizeFirstLetter', () => {
  test('should capitalizeFirstLetter of bank', () => {
    const result = capitalizeFirstLetter('bank');
    expect(result).toBe('Bank');
  });
  test('should capitalizeFirstLetter of победа', () => {
    const result = capitalizeFirstLetter('победа');
    expect(result).toBe('Победа');
  });
});
