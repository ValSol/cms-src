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
import { getFieldValue } from '../core/utils';
import {
  composeEmptyContentState,
  editorStateDecorator as decorator,
} from '../core/draft';

const initialState = {};

export default (state = initialState, action) => {
  const {
    type,
    content,
    editorState,
    pictures,
    richTextFieldName,
    submitting,
    thing,
    thingConfig,
  } = action;

  // получаем ключ ведущий к данным
  const key =
    thingConfig && richTextFieldName
      ? `${thingConfig.thingName}:${richTextFieldName}`
      : null; // в случае если type не соотвтествует reducer'у
  switch (type) {
    // eslint-disable-next-line no-case-declarations
    case RICHTEXTEDITOR_ADD_DATA:
      // составляем и устанавливаем данные соответствующие ricthText полю
      const richTextFieldContent = getFieldValue(thing, richTextFieldName);
      const value = {
        initial: {
          _id: thing._id, // eslint-disable-line no-underscore-dangle
          pictures: thing.pictures,
          [richTextFieldName]: getFieldValue(thing, richTextFieldName),
        },
        values: {
          _id: thing._id, // eslint-disable-line no-underscore-dangle
          pictures: thing.pictures,
          [richTextFieldName]: richTextFieldContent,
        },
        editorState: Object.keys(richTextFieldContent).reduce(
          (prev, locale) => {
            // eslint-disable-next-line no-param-reassign
            prev[locale] = richTextFieldContent[locale]
              ? EditorState.createWithContent(
                  convertFromRaw(richTextFieldContent[locale]),
                  decorator,
                )
              : EditorState.createWithContent(
                  composeEmptyContentState(),
                  decorator,
                );
            return prev;
          },
          {},
        ),
        submitting: false,
      };
      return { ...state, [key]: value };
    case RICHTEXTEDITOR_REMOVE_DATA:
      return { ...state, [key]: undefined };
    case RICHTEXTEDITOR_SET_SUBMITTING:
      return { ...state, [key]: { ...state[key], submitting } };
    // eslint-disable-next-line no-case-declarations
    case RICHTEXTEDITOR_UPDATE_PICTURES:
      const value2 = {
        ...state[key],
        initial: state[key].initial,
        values: { ...state[key].values, pictures },
      };
      return { ...state, [key]: value2 };
    // eslint-disable-next-line no-case-declarations
    case RICHTEXTEDITOR_UPDATE_CONTENT:
      const value3 = {
        ...state[key],
        initial: state[key].initial,
        values: {
          ...state[key].values,
          [richTextFieldName]: {
            ...state[key].values[richTextFieldName],
            ...content,
          },
        },
      };
      return { ...state, [key]: value3 };
    // eslint-disable-next-line no-case-declarations
    case RICHTEXTEDITOR_UPDATE_EDITORSTATE:
      const value4 = {
        ...state[key],
        initial: state[key].initial,
        values: state[key].values,
        editorState: { ...state[key].editorState, ...editorState },
      };
      return { ...state, [key]: value4 };
    // eslint-disable-next-line no-case-declarations
    case RICHTEXTEDITOR_RESET_INITIAL:
      const value5 = {
        ...state[key],
        initial: { ...state[key].values },
      };
      return { ...state, [key]: value5 };
    default:
      return state;
  }
};
