/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
import composeFormDataForUpload from './composeFormDataForUpload';

describe('composeFormDataForUpload core util', () => {
  const thingConfig = {
    thingName: 'Article',
    uploadedFields: ['pictures'],
  };
  test('should return null if there are not uploadedFields', () => {
    const fields = { _id: '12345', subject: ['patent'], section: 'info' };
    const result = composeFormDataForUpload(fields, thingConfig);
    expect(result).toBeNull();
  });
  test('should return null if there are not uploadedFields', () => {
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
    const result = composeFormDataForUpload(fields, thingConfig);
    expect(result).toBeNull();
  });
  test('should return FormData if there are uploadedFields', () => {
    // иммитируем блобы ссылающиеся на сайты
    const file1 = new Blob();
    file1.name = 'media-logo.gif';
    file1.preview = 'blob:media-logo';

    const file2 = new Blob();
    file2.name = 'top.gif';
    file2.preview = 'blob:top';

    const fields = {
      _id: '12345',
      subject: ['patent'],
      section: 'info',
      pictures: [
        { src: '/images/1.gif' },
        {
          src: 'blob:media-logo.gif',
          file: file1,
        },
        {
          src: 'blob:top.gif',
          file: file2,
        },
      ],
    };
    const expectedKeys = ['blob:media-logo.gif', 'blob:top.gif'];
    const [formData, fileNames] = composeFormDataForUpload(fields, thingConfig);
    expect(formData).not.toBeNull();
    expect(Object.keys(fileNames)).toEqual(expectedKeys);
  });
});
