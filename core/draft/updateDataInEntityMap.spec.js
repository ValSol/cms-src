/* eslint-env jest */

import updateDataInEntityMap from './updateDataInEntityMap';

describe('updateDataInEntityMap core draft util', () => {
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
          width: '50',
          height: '100',
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
    const entitiesDataForUpdate = {
      IMAGE: {
        uniqueDataAttrName: 'src',
        dataForUpdate: [
          {
            src: '/pictures/image1',
            widht: 100,
            height: 200,
          },
          {
            src: '/pictures/image2',
            widht: 200,
            height: 400,
          },
          {
            src: '/pictures/image3',
            widht: 300,
            height: 900,
          },
        ],
      },
      LINK: {
        uniqueDataAttrName: 'href',
        dataForUpdate: [
          {
            href: '/docs/pdf1',
            color: 'red',
          },
          {
            href: '/docs/pdf2',
            color: 'blue',
          },
          {
            href: '/docs/pdf3',
            color: 'white',
          },
        ],
      },
    };
    const expectedResult = {
      entityMap: {
        0: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image1',
            widht: 100,
            height: 200,
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
            color: 'blue',
          },
        },
        3: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image3',
            widht: 300,
            height: 900,
          },
        },
        4: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image0',
            width: '50',
            height: '100',
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
    const result = updateDataInEntityMap(content, entitiesDataForUpdate);
    expect(result).toEqual(expectedResult);
  });
  test('should not udated content if there are not data for replace', () => {
    const entitiesDataForUpdate = {
      IMAGE: {
        uniqueDataAttrName: 'src',
        dataForUpdate: [
          {
            src: '/pictures/image10',
            widht: 100,
            height: 200,
          },
          {
            src: '/pictures/image20',
            widht: 200,
            height: 400,
          },
          {
            src: '/pictures/image30',
            widht: 300,
            height: 900,
          },
        ],
      },
      LINK: {
        uniqueDataAttrName: 'href',
        dataForUpdate: [
          {
            href: '/docs/pdf10',
            color: 'red',
          },
          {
            href: '/docs/pdf20',
            color: 'blue',
          },
          {
            href: '/docs/pdf30',
            color: 'white',
          },
        ],
      },
    };
    const result = updateDataInEntityMap(content, entitiesDataForUpdate);
    expect(result).toBe(content);
  });
});
