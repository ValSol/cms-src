/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import removeUploadedFiles from './removeUploadedFiles';

describe('removeUploadedFiles core util', () => {
  const thingConfig = {
    uploadedFields: ['pictures'],
  };
  beforeEach(() => {
    // будем использовать мок revokeObjectURL
    // чтобы не выдавало ошибку на вызов window.URL.revokeObjectURL
    window.URL.revokeObjectURL = () => {};
  });
  afterEach(() => {
    window.URL.revokeObjectURL = undefined;
  });
  test('should return fields without file property and with new src', () => {
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
            preview: 'blob:media-logo.gif',
          },
        },
        {
          src: 'blob:top.gif',
          file: {
            name: 'top.gif',
            preview: 'blob:top.gif',
          },
        },
      ],
    };
    const fileNames = {
      'blob:media-logo.gif': 'media-logo.gif',
      'blob:top.gif': 'top.gif',
    };

    const data = {
      'media-logo.gif': '/images/media-logo.gif',
      'top.gif': '/images/top.gif',
    };

    const expectedResult = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      pictures: [
        { src: '/images/1.gif' },
        { src: '/images/media-logo.gif' },
        { src: '/images/top.gif' },
      ],
    };
    const result = removeUploadedFiles(fields, thingConfig, fileNames, data);
    expect(result).toEqual(expectedResult);
  });
  test('should return fields equal to []', () => {
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
            preview: 'blob:media-logo.gif',
          },
        },
        {
          src: 'blob:top.gif',
          file: {
            name: 'top.gif',
            preview: 'blob:top.gif',
          },
        },
      ],
    };

    const expectedResult = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      pictures: [],
    };
    const result = removeUploadedFiles(fields, thingConfig);
    expect(result).toEqual(expectedResult);
  });
});
