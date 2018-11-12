/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import { LocalStorage } from 'node-localstorage';

import { saveState } from '../../../core/utils';

import getLayout from './getLayout';

describe('getLayout of MultiLingualRichTextEditor component', () => {
  beforeEach(() => {
    // будем использовать мок localStorage
    global.localStorage = new LocalStorage('localStorage.tmp');
    global.window.localStorage = localStorage;
  });
  afterEach(() => {
    global.localStorage = undefined;
    global.window.localStorage = undefined;
  });
  const thingConfig = { thingName: 'Article' };
  test('should return saved in localStorage layout', () => {
    const layout = [
      {
        w: 6,
        h: 27,
        x: 0,
        y: 0,
        i: 'uk-27',
        moved: false,
        static: false,
      },
      {
        w: 6,
        h: 25,
        x: 0,
        y: 52,
        i: 'ru-25',
        moved: false,
        static: false,
      },
      {
        w: 7,
        h: 25,
        x: 0,
        y: 27,
        i: 'en-25',
        moved: false,
        static: false,
      },
    ];
    saveState('extraSmall:ArticleContentEditorGridLayout', layout);
    const expectedResult = {
      ukLayout: {
        w: 12,
        h: 1,
        x: 0,
        y: 0,
      },
      ruLayout: {
        w: 12,
        h: 1,
        x: 0,
        y: 52,
      },
      enLayout: {
        w: 12,
        h: 1,
        x: 0,
        y: 27,
      },
    };
    const result = getLayout('extraSmall', thingConfig);
    expect(result).toEqual(expectedResult);
    localStorage.removeItem('extraSmall:ArticleContentEditorGridLayout');
  });
});
