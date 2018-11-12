/* eslint-env jest */
import Promise from 'bluebird';
import asyncValidate from './asyncValidate';

describe('asyncSignUpValidate', () => {
  test('should return promise with undefined for empty fields', async () => {
    const fields = {};
    const client = null;
    const result = await asyncValidate(fields, null, { client });
    expect(result).toBeUndefined();
  });
  test('should return promise with undefined for incorrect email', async () => {
    const email = 'incorrect-new-email';
    const fields = { email };
    const client = null;
    const result = await asyncValidate(fields, null, { client });
    expect(result).toBeUndefined();
  });
  test('should return promise with undefined if not found document', async () => {
    const query = jest.fn();
    const email = 'example-new@example.com';
    const fields = { email };
    // формируем мок который не находит пользователя с новым email
    query.mockReturnValueOnce(Promise.resolve({ data: { user: null } }));
    const client = { query };
    const result = await asyncValidate(fields, null, { client });
    expect(result).toBeUndefined();
  });
  test('should throw error in promise "Email already taken"', async () => {
    const query = jest.fn();
    const email = 'example@example.com';
    const fields = { email };
    // формируем мок который не находит пользователя с новым email
    query.mockReturnValueOnce(Promise.resolve({ data: { user: null } }));
    const client = { query };
    try {
      await asyncValidate(fields, null, { client });
    } catch (err) {
      expect(err).toEqual({
        email: 'EmailAlreadyTaken',
      });
    }
  });
});
