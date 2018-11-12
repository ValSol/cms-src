/* eslint-env jest */

import {
  RICHTEXTEDITOR_ADD_DATA,
  RICHTEXTEDITOR_REMOVE_DATA,
  RICHTEXTEDITOR_RESET_INITIAL,
  RICHTEXTEDITOR_SET_SUBMITTING,
  RICHTEXTEDITOR_UPDATE_PICTURES,
  RICHTEXTEDITOR_UPDATE_CONTENT,
  RICHTEXTEDITOR_UPDATE_EDITORSTATE,
} from '../constants';

import {
  addRichtexteditorData,
  removeRichtexteditorData,
  resetRichtexteditorInitial,
  setRichtexteditorSubmitting,
  updateRichtexteditorPictures,
  updateRichtexteditorContent,
  updateRichtexteditorEditorState,
} from './richtexteditor';

describe('richtexteditor actions', () => {
  const richTextFieldName = 'content';
  const thingConfig = { thingName: 'Article' };
  describe('addRichtexteditorData', () => {
    test('should create an action to add data', () => {
      const thing = {
        content: {
          uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр' }] },
          ru: { entityMap: {}, blocks: [{ key: 'ru', text: 'рус' }] },
          en: { entityMap: {}, blocks: [{ key: 'en', text: 'eng' }] },
        },
        pictures: [],
      };
      const expectedAction = {
        type: RICHTEXTEDITOR_ADD_DATA,
        richTextFieldName,
        thingConfig,
        thing,
      };
      expect(
        addRichtexteditorData({ richTextFieldName, thingConfig, thing }),
      ).toEqual(expectedAction);
    });
  });

  describe('removeRichtexteditorData', () => {
    test('should create an action to remove data', () => {
      const expectedAction = {
        type: RICHTEXTEDITOR_REMOVE_DATA,
        richTextFieldName,
        thingConfig,
      };
      expect(
        removeRichtexteditorData({ richTextFieldName, thingConfig }),
      ).toEqual(expectedAction);
    });
  });

  describe('setRichtexteditorSubmitting', () => {
    test('should create an action to update submitting property', () => {
      const submitting = true;
      const expectedAction = {
        type: RICHTEXTEDITOR_SET_SUBMITTING,
        richTextFieldName,
        thingConfig,
        submitting,
      };
      expect(
        setRichtexteditorSubmitting({
          richTextFieldName,
          thingConfig,
          submitting,
        }),
      ).toEqual(expectedAction);
    });
  });

  describe('updateRichtexteditorPictures', () => {
    test('should create an action to update pictures', () => {
      const pictures = [];
      const expectedAction = {
        type: RICHTEXTEDITOR_UPDATE_PICTURES,
        richTextFieldName,
        thingConfig,
        pictures,
      };
      expect(
        updateRichtexteditorPictures({
          richTextFieldName,
          thingConfig,
          pictures,
        }),
      ).toEqual(expectedAction);
    });
  });

  describe('updateRichtexteditorContent', () => {
    test('should create an action to update content', () => {
      const content = {
        uk: { entityMap: {}, blocks: [{ key: 'uk', text: 'укр+' }] },
      };
      const expectedAction = {
        type: RICHTEXTEDITOR_UPDATE_CONTENT,
        richTextFieldName,
        thingConfig,
        content,
      };
      expect(
        updateRichtexteditorContent({
          richTextFieldName,
          thingConfig,
          content,
        }),
      ).toEqual(expectedAction);
    });
  });

  describe('updateRichtexteditorEditorState', () => {
    test('should create an action to update editorState', () => {
      const editorState = { uk: 'ukEditorState' };
      const expectedAction = {
        type: RICHTEXTEDITOR_UPDATE_EDITORSTATE,
        richTextFieldName,
        thingConfig,
        editorState,
      };
      expect(
        updateRichtexteditorEditorState({
          richTextFieldName,
          thingConfig,
          editorState,
        }),
      ).toEqual(expectedAction);
    });
  });

  describe('resetRichtexteditorInitial', () => {
    test('should create an action to reset initial', () => {
      const expectedAction = {
        type: RICHTEXTEDITOR_RESET_INITIAL,
        richTextFieldName,
        thingConfig,
      };
      expect(
        resetRichtexteditorInitial({
          richTextFieldName,
          thingConfig,
        }),
      ).toEqual(expectedAction);
    });
  });
});
