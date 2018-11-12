/* eslint-disable import/prefer-default-export */

import {
  RICHTEXTEDITOR_ADD_DATA,
  RICHTEXTEDITOR_REMOVE_DATA,
  RICHTEXTEDITOR_SET_SUBMITTING,
  RICHTEXTEDITOR_UPDATE_PICTURES,
  RICHTEXTEDITOR_UPDATE_CONTENT,
  RICHTEXTEDITOR_UPDATE_EDITORSTATE,
  RICHTEXTEDITOR_RESET_INITIAL,
} from '../constants';

export const addRichtexteditorData = ({
  richTextFieldName,
  thingConfig,
  thing,
}) => ({
  type: RICHTEXTEDITOR_ADD_DATA,
  richTextFieldName,
  thingConfig,
  thing,
});

export const removeRichtexteditorData = ({
  richTextFieldName,
  thingConfig,
}) => ({
  type: RICHTEXTEDITOR_REMOVE_DATA,
  richTextFieldName,
  thingConfig,
});

export const setRichtexteditorSubmitting = ({
  richTextFieldName,
  thingConfig,
  submitting,
}) => ({
  type: RICHTEXTEDITOR_SET_SUBMITTING,
  richTextFieldName,
  thingConfig,
  submitting,
});

export const updateRichtexteditorPictures = ({
  richTextFieldName,
  thingConfig,
  pictures,
}) => ({
  type: RICHTEXTEDITOR_UPDATE_PICTURES,
  richTextFieldName,
  thingConfig,
  pictures,
});

export const updateRichtexteditorContent = ({
  richTextFieldName,
  thingConfig,
  content,
}) => ({
  type: RICHTEXTEDITOR_UPDATE_CONTENT,
  richTextFieldName,
  thingConfig,
  content,
});

export const updateRichtexteditorEditorState = ({
  richTextFieldName,
  thingConfig,
  editorState,
}) => ({
  type: RICHTEXTEDITOR_UPDATE_EDITORSTATE,
  richTextFieldName,
  thingConfig,
  editorState,
});

// копирует данные из values в initial
export const resetRichtexteditorInitial = ({
  richTextFieldName,
  thingConfig,
}) => ({
  type: RICHTEXTEDITOR_RESET_INITIAL,
  richTextFieldName,
  thingConfig,
});
