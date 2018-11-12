/* eslint-env jest */
import { convertFromRaw, EditorState } from 'draft-js';

import {
  RICHTEXTEDITOR_ADD_DATA,
  RICHTEXTEDITOR_REMOVE_DATA,
  RICHTEXTEDITOR_SET_SUBMITTING,
  RICHTEXTEDITOR_UPDATE_PICTURES,
  RICHTEXTEDITOR_UPDATE_CONTENT,
  RICHTEXTEDITOR_UPDATE_EDITORSTATE,
  RICHTEXTEDITOR_RESET_INITIAL,
} from '../constants';
import { editorStateDecorator as decorator } from '../core/draft';

import reducer from './richtexteditor';

describe('richtexteditor reducer', () => {
  const richTextFieldName = 'content';
  const thingConfig = { thingName: 'Article' };
  const thing = {
    _id: '1234567890',
    pictures: [],
    content: {
      uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр' }] },
      ru: { entityMap: {}, blocks: [{ key: 'ru', text: 'рус' }] },
      en: { entityMap: {}, blocks: [{ key: 'en', text: 'eng' }] },
    },
    title: { uk: 'назва', ru: 'название', en: 'title' },
  };
  const initial = {
    // eslint-disable-next-line no-underscore-dangle
    _id: thing._id,
    content: thing.content,
    pictures: thing.pictures,
  };
  const values = {
    // eslint-disable-next-line no-underscore-dangle
    _id: thing._id,
    content: thing.content,
    pictures: thing.pictures,
  };
  const editorState = {
    uk: EditorState.createWithContent(
      convertFromRaw(thing.content.uk),
      decorator,
    ),
    ru: EditorState.createWithContent(
      convertFromRaw(thing.content.ru),
      decorator,
    ),
    en: EditorState.createWithContent(
      convertFromRaw(thing.content.en),
      decorator,
    ),
  };

  const store = {
    'Article:content': { initial, values, editorState, submitting: false },
  };

  test('should return the new richtexteditor state', () => {
    const newStore = reducer(undefined, {});
    expect(newStore).toEqual({});
  });

  test('should add richtexteditor data', () => {
    const store0 = {};
    const action = {
      type: RICHTEXTEDITOR_ADD_DATA,
      richTextFieldName,
      thingConfig,
      thing,
    };
    const expectedResult = { ...store };
    const newStore = reducer(store0, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual(expectedResult);
  });

  test('should remove richtexteditor data', () => {
    const store0 = { 'Article:content': {}, 'Restoran:content': {} };
    const action = {
      type: RICHTEXTEDITOR_REMOVE_DATA,
      richTextFieldName,
      thingConfig,
    };
    const expectedResult = { 'Restoran:content': {} };
    const newStore = reducer(store0, action);
    expect(newStore).not.toBe(store);
    expect(newStore).toEqual(expectedResult);
  });

  test('should set submitting for richtexteditor data', () => {
    const action = {
      type: RICHTEXTEDITOR_SET_SUBMITTING,
      richTextFieldName,
      thingConfig,
      submitting: true,
    };
    const expectedResult = {
      'Article:content': { editorState, initial, values, submitting: true },
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore['Article:content'].initial).toBe(initial);
    expect(newStore['Article:content'].values).toBe(values);
    expect(newStore).toEqual(expectedResult);
  });

  test('should update pictures richtexteditor data', () => {
    const newPictures = ['picture1'];
    const action = {
      type: RICHTEXTEDITOR_UPDATE_PICTURES,
      richTextFieldName,
      thingConfig,
      pictures: newPictures,
    };
    const expectedResult = {
      'Article:content': {
        editorState,
        initial,
        values: { ...values, pictures: newPictures },
        submitting: false,
      },
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore['Article:content'].initial).toBe(initial);
    expect(newStore['Article:content'].values).not.toBe(values);
    expect(newStore['Article:content'].values.content).toBe(values.content);
    expect(newStore).toEqual(expectedResult);
  });

  test('should update content richtexteditor data', () => {
    const newContent = {
      uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр+' }] },
    };
    const action = {
      type: RICHTEXTEDITOR_UPDATE_CONTENT,
      richTextFieldName,
      thingConfig,
      content: newContent,
    };
    const expectedResult = {
      'Article:content': {
        initial,
        editorState,
        values: { ...values, content: { ...values.content, ...newContent } },
        submitting: false,
      },
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore['Article:content'].initial).toBe(initial);
    expect(newStore['Article:content'].values).not.toBe(values);
    expect(newStore['Article:content'].values.pictures).toBe(values.pictures);
    expect(newStore).toEqual(expectedResult);
  });

  test('should update editorState richtexteditor data', () => {
    const newContent = {
      uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр+' }] },
    };
    const newEditorState = {
      uk: EditorState.createWithContent(
        convertFromRaw(newContent.uk),
        decorator,
      ),
    };
    const action = {
      type: RICHTEXTEDITOR_UPDATE_EDITORSTATE,
      editorState: newEditorState,
      richTextFieldName,
      thingConfig,
    };
    const expectedResult = {
      'Article:content': {
        initial,
        editorState: { ...editorState, ...newEditorState },
        values,
        submitting: false,
      },
    };
    const newStore = reducer(store, action);
    expect(newStore).not.toBe(store);
    expect(newStore['Article:content'].initial).toBe(initial);
    expect(newStore['Article:content'].values).toBe(values);
    expect(newStore['Article:content'].values.pictures).toBe(values.pictures);
    expect(newStore['Article:content'].editorState).not.toBe(editorState);
    expect(newStore).toEqual(expectedResult);
  });

  test('should reset initial for richtexteditor data', () => {
    const values2 = {
      _id: thing._id, // eslint-disable-line no-underscore-dangle
      content: {
        uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр+' }] },
        ru: { entityMap: {}, blocks: [{ key: 'ru', text: 'рус+' }] },
        en: { entityMap: {}, blocks: [{ key: 'en', text: 'eng+' }] },
      },
      pictures: ['picture1'],
    };
    const store2 = {
      'Article:content': {
        initial,
        values: values2,
        editorState,
        submitting: false,
      },
    };
    const action = {
      type: RICHTEXTEDITOR_RESET_INITIAL,
      richTextFieldName,
      thingConfig,
    };
    const expectedResult = {
      'Article:content': {
        initial: values2,
        values: values2,
        editorState,
        submitting: false,
      },
    };
    const newStore = reducer(store2, action);
    expect(newStore).not.toBe(store2);
    expect(newStore['Article:content'].initial).not.toBe(initial);
    expect(newStore['Article:content'].initial).not.toBe(values2);
    expect(newStore['Article:content'].values).toBe(values2);
    expect(newStore['Article:content'].editorState).toBe(editorState);
    expect(newStore).toEqual(expectedResult);
  });
});
