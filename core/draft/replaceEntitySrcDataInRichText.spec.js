/* eslint-env jest */
import replaceEntitySrcDataInRichText from './replaceEntitySrcDataInRichText';

describe('replaceEntitySrcDataInRichText core draft util', () => {
  const thingConfig = {
    richTextFields: ['content'],
  };
  const content = {
    entityMap: {
      0: {
        type: 'IMAGE',
        data: {
          src: 'blob:image1',
        },
      },
      1: {
        type: 'LINK',
        data: {
          href: '/about',
        },
      },
      2: {
        type: 'LINK',
        data: {
          href: '/docs/pdf2',
        },
      },
      3: {
        type: 'IMAGE',
        data: {
          src: 'blob:image3',
        },
      },
      4: {
        type: 'IMAGE',
        data: {
          src: '/pictures/image0',
        },
      },
    },
    blocks: [
      {
        entityRanges: [],
        key: 'line1',
        text: '',
        type: 'unstyled',
      },
      {
        entityRanges: [],
        key: 'line2',
        text: '',
        type: 'unstyled',
      },
    ],
  };

  const fields = {
    _id: '1',
    content: {
      uk: content,
      en: content,
    },
  };

  test('should udated content if there are data for replace', () => {
    const fileNames = {
      'blob:image1': 'image1',
      'blob:image2': 'image2',
      'blob:image3': 'image3',
    };
    const data = {
      image1: '/pictures/image1',
      image2: '/pictures/image2',
      image3: '/pictures/image3',
    };
    const expectedContent = {
      entityMap: {
        0: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image1',
          },
        },
        1: {
          type: 'LINK',
          data: {
            href: '/about',
          },
        },
        2: {
          type: 'LINK',
          data: {
            href: '/docs/pdf2',
          },
        },
        3: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image3',
          },
        },
        4: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image0',
          },
        },
      },
      blocks: [
        {
          entityRanges: [],
          key: 'line1',
          text: '',
          type: 'unstyled',
        },
        {
          entityRanges: [],
          key: 'line2',
          text: '',
          type: 'unstyled',
        },
      ],
    };
    const expectedResult = {
      _id: '1',
      content: {
        uk: expectedContent,
        en: expectedContent,
      },
    };
    const result = replaceEntitySrcDataInRichText(
      fields,
      fileNames,
      data,
      thingConfig,
    );
    expect(result).toEqual(expectedResult);
  });
});
