/* eslint-env jest */
import isMongoId from 'validator/lib/isMongoId';

import getEntitiesDataFromFields from './getEntitiesDataFromFields';

describe('getEntitiesDataFromFields core draft util', () => {
  const rawContent = {
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/patent/info',
          _id: '5a9c3bb526331a1ba02b062f',
          thingName: 'Article',
        },
      },
      1: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/patent/info/abc',
          _id: '5a9c3bb526331a1ba02b0630',
          thingName: 'Article',
        },
      },
      2: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '5ac8b9cd6d500106ec111ec7',
          thingName: 'Service',
        },
      },
      3: {
        type: 'LINK2',
        mutability: 'MUTABLE',
        data: { href: '/admin/articles' },
      },
      4: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: { href: '/trademark/info' },
      },
      5: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '12345',
          thingName: 'Service',
        },
      },
      6: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '5a97e8db20d03c11507603ac',
          thingName: 'Service666',
        },
      },
    },
  };

  const rawContent2 = {
    entityMap: {
      0: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          _id: '5ac7ac4f09bccf0a306cdaed',
          thingName: 'Service',
        },
      },
      // повторяем уже имеющуюся ссылку в rawContent чтобы убедиться что ...
      // ... все ссылки на ОДИН thing объект в результате объединяются в одну ссылку
      1: {
        type: 'LINK',
        mutability: 'MUTABLE',
        data: {
          href: '/design/info',
          _id: '5ac8b9cd6d500106ec111ec7',
          thingName: 'Service',
        },
      },
    },
  };

  const dataCheck = {
    _id: arg => arg && isMongoId(arg),
    thingName: arg => arg && ['Article', 'Service'].includes(arg),
  };

  const entityType = 'LINK';

  const Feature = {
    richTextFields: ['content', 'content2'],
    subDocumentFields: [],
  };

  const Feature2 = {
    richTextFields: ['content', 'content2'],
    subDocumentFields: [
      {
        name: 'feature',
        array: false,
        attributes: Feature,
      },
      {
        name: 'features',
        array: true,
        attributes: Feature,
      },
    ],
  };

  const thingConfig = {
    richTextFields: ['content', 'content2'],
    subDocumentFields: [
      {
        name: 'feature2',
        array: false,
        attributes: Feature2,
      },
      {
        name: 'features2',
        array: true,
        attributes: Feature2,
      },
    ],
  };

  const appConfig = {
    locales: ['uk', 'ru', 'en'],
  };

  test('should return empty array of entities', () => {
    const fields = {};
    const expectedResult = [];
    const result = getEntitiesDataFromFields(
      fields,
      entityType,
      dataCheck,
      thingConfig,
      appConfig,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of entities', () => {
    const fields = {
      content: { uk: rawContent, ru: rawContent },
      content2: { uk: rawContent2, en: rawContent2 },
    };
    const expectedResult = [
      {
        _id: '5a9c3bb526331a1ba02b062f',
        thingName: 'Article',
      },
      {
        _id: '5a9c3bb526331a1ba02b0630',
        thingName: 'Article',
      },
      {
        _id: '5ac8b9cd6d500106ec111ec7',
        thingName: 'Service',
      },
      {
        _id: '5ac7ac4f09bccf0a306cdaed',
        thingName: 'Service',
      },
    ];
    const result = getEntitiesDataFromFields(
      fields,
      entityType,
      dataCheck,
      thingConfig,
      appConfig,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of entities from subDocuments', () => {
    const fields = {
      feature2: {
        feature: {
          content: { uk: rawContent, ru: rawContent },
          content2: { uk: rawContent2, en: rawContent2 },
        },
      },
    };
    const expectedResult = [
      {
        _id: '5a9c3bb526331a1ba02b062f',
        thingName: 'Article',
      },
      {
        _id: '5a9c3bb526331a1ba02b0630',
        thingName: 'Article',
      },
      {
        _id: '5ac8b9cd6d500106ec111ec7',
        thingName: 'Service',
      },
      {
        _id: '5ac7ac4f09bccf0a306cdaed',
        thingName: 'Service',
      },
    ];
    const result = getEntitiesDataFromFields(
      fields,
      entityType,
      dataCheck,
      thingConfig,
      appConfig,
    );
    expect(result).toEqual(expectedResult);
  });
  test('should return array of entities from subDocuments', () => {
    const fields = {
      features2: [
        {
          features: [
            {
              content: { uk: rawContent, ru: rawContent },
              content2: { uk: rawContent2, en: rawContent2 },
            },
          ],
        },
      ],
    };
    const expectedResult = [
      {
        _id: '5a9c3bb526331a1ba02b062f',
        thingName: 'Article',
      },
      {
        _id: '5a9c3bb526331a1ba02b0630',
        thingName: 'Article',
      },
      {
        _id: '5ac8b9cd6d500106ec111ec7',
        thingName: 'Service',
      },
      {
        _id: '5ac7ac4f09bccf0a306cdaed',
        thingName: 'Service',
      },
    ];
    const result = getEntitiesDataFromFields(
      fields,
      entityType,
      dataCheck,
      thingConfig,
      appConfig,
    );
    expect(result).toEqual(expectedResult);
  });
});
