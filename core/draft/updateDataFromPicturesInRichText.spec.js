/* eslint-env jest */
import updateDataFromPicturesInRichText from './updateDataFromPicturesInRichText';

describe('updateDataFromPicturesInRichText core draft util', () => {
  const thingConfig = {
    richTextFields: ['content'],
  };
  const content = {
    entityMap: {
      0: {
        type: 'IMAGE',
        data: {
          src: '/pictures/image1',
          caption: { uk: '', ru: '', en: '' },
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
  const pictures = [
    {
      src: '/pictures/image1',
      caption: { uk: 'підпис', ru: 'подпись', en: 'caption' },
      width: 100,
      height: 200,
      md5hash: '111',
    },
    {
      src: '/pictures/image2',
      width: 200,
      height: 400,
      md5hash: '222',
    },
    {
      src: '/pictures/image3',
      width: 300,
      height: 900,
      md5hash: '333',
    },
  ];
  const fields = {
    _id: '1',
    content: {
      uk: content,
      en: content,
    },
    pictures,
  };

  test('should udated content if there are data for update', () => {
    const expectedContent = {
      entityMap: {
        0: {
          type: 'IMAGE',
          data: {
            src: '/pictures/image1',
            width: '100',
            height: '200',
            caption: { uk: 'підпис', ru: 'подпись', en: 'caption' },
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
            width: '300',
            height: '900',
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
    const expectedResult = {
      _id: '1',
      content: {
        uk: expectedContent,
        en: expectedContent,
      },
      pictures,
    };
    const result = updateDataFromPicturesInRichText(fields, thingConfig);
    expect(result).toEqual(expectedResult);
    // проверяем что entytyMap в fields и result НЕ равны (отвязаны друг от друга)
    expect(result.content.uk.entityMap).not.toBe(fields.content.uk.entityMap);
  });
});
