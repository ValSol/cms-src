/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import thereAreFilesForUpload from './thereAreFilesForUpload';

describe('thereAreFilesForUpload core util', () => {
  const thingConfig = {
    uploadedFields: ['pictures'],
  };
  test('should return false if there are not uploadedFields', () => {
    const fields = { _id: '12345', subject: ['patent'], section: 'info' };
    const result = thereAreFilesForUpload(fields, thingConfig);
    // не используем toBeFalsy чтобы контролировать возврат именно 'false'
    expect(result).toBe(false);
  });
  test('should return null if there are not uploadedFields 2', () => {
    const fields = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      pictures: [
        { src: '/images/1.gif' },
        { src: '/images/2.gif' },
        { src: '/images/3.gif' },
      ],
    };
    const result = thereAreFilesForUpload(fields, thingConfig);
    // не используем toBeFalsy чтобы контролировать возврат именно 'false'
    expect(result).toBe(false);
  });
  test('should return true if there are uploadedField as array', () => {
    const fields = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      pictures: [
        { src: '/images/1.gif' },
        {
          src: 'blob:media-logo.gif',
          file: {
            name: 'media-logo.gif',
            preview: 'blob:media-logo',
          },
        },
        {
          src: 'blob:top.gif',
          file: {
            name: 'top.gif',
            preview: 'blob:top',
          },
        },
      ],
    };
    const result = thereAreFilesForUpload(fields, thingConfig);
    // не используем toBeTruthy чтобы контролировать возврат именно 'true'
    expect(result).toBe(true);
  });
  test('should return true if there are uploadedFields', () => {
    const config2 = {
      uploadedFields: ['logo', 'pictures'],
    };
    const fields = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      logo: {
        src: 'blob:media-logo.gif',
        file: {
          name: 'media-logo.gif',
          preview: 'blob:media-logo',
        },
      },
    };
    const result = thereAreFilesForUpload(fields, config2);
    // не используем toBeTruthy чтобы контролировать возврат именно 'true'
    expect(result).toBe(true);
  });
});
