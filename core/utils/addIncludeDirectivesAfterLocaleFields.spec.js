/* eslint-env jest */
import addIncludeDirectivesAfterLocaleFields from './addIncludeDirectivesAfterLocaleFields';

describe('addIncludeDirectivesAfterLocaleFields core util', () => {
  test('should return fields with include directives', () => {
    const fields = {
      pictrues: {
        src: null,
        width: null,
        height: null,
        caption: {
          uk: null,
          ru: null,
          en: null,
        },
      },
      _id: null,
    };
    const expectedResult = {
      pictrues: {
        src: null,
        width: null,
        height: null,
        caption: {
          'uk @include(if: $uk)': null,
          'ru @include(if: $ru)': null,
          'en @include(if: $en)': null,
        },
      },
      _id: null,
    };
    expect(addIncludeDirectivesAfterLocaleFields(fields)).toEqual(
      expectedResult,
    );
  });
});
