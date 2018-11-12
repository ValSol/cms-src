/* eslint-env jest */

import thereAreBlobs from './thereAreBlobs';

describe('replaceUniqueDataInEntityMap core draft util', () => {
  test('should udated content if there are data for replace', () => {
    const content = {
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
    const result = thereAreBlobs(content, { IMAGE: 'src' });
    const expectedResult = true;
    expect(result).toBe(expectedResult);
  });
  test('should not udated content if there are not data for replace', () => {
    const content = {
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
            href: 'blob:pdf2',
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
    const result = thereAreBlobs(content, { IMAGE: 'src' });
    const expectedResult = false;
    expect(result).toBe(expectedResult);
  });
});
