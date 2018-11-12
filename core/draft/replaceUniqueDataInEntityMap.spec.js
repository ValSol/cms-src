/* eslint-env jest */

import replaceUniqueDataInEntityMap from './replaceUniqueDataInEntityMap';

describe('replaceUniqueDataInEntityMap core draft util', () => {
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
          href: 'blob:pdf2',
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

  test('should udated content if there are data for replace', () => {
    const entitiesDataForChange = {
      IMAGE: {
        src: {
          'blob:image1': '/pictures/image1',
          'blob:image2': '/pictures/image2',
          'blob:image3': '/pictures/image3',
        },
      },
      LINK: {
        href: {
          'blob:pdf1': '/docs/pdf1',
          'blob:pdf2': '/docs/pdf2',
          'blob:pdf3': '/docs/pdf3',
        },
      },
    };
    const expectedResult = {
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
    const result = replaceUniqueDataInEntityMap(content, entitiesDataForChange);
    expect(result).toEqual(expectedResult);
  });
  test('should not udated content if there are not data for replace', () => {
    const entitiesDataForChange = {
      IMAGE: {
        src: {
          'blob:image10': '/pictures/image10',
          'blob:image20': '/pictures/image20',
          'blob:image30': '/pictures/image30',
        },
      },
      LINK: {
        href: {
          'blob:pdf10': '/docs/pdf10',
          'blob:pdf20': '/docs/pdf20',
          'blob:pdf30': '/docs/pdf30',
        },
      },
    };
    const result = replaceUniqueDataInEntityMap(content, entitiesDataForChange);
    expect(result).toBe(content);
  });
});
