import React from 'react';
import PropTypes from 'prop-types';
import { convertFromRaw, Editor, EditorState } from 'draft-js';

import {
  composeEmptyContentState,
  editorStateDecorator as decorator,
  mediaBlockRenderer,
} from '../../../core/draft';

const ServicePreview = ({ lang, thing }) => {
  const id = thing._id; // eslint-disable-line no-underscore-dangle
  const title = thing.title[lang];
  const content = thing.content[lang];

  // content получаем в формате draft.js Raw
  const editorState = content
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(content)),
        decorator,
      )
    : EditorState.createWithContent(composeEmptyContentState());
  return (
    <div>
      <h1>{title}</h1>
      <hr />
      <div style={{ fontSize: '16px', lineHeight: '24px' }}>
        <Editor
          editorKey={id}
          blockRendererFn={mediaBlockRenderer}
          editorState={editorState}
          readOnly
        />
      </div>
    </div>
  );
};

ServicePreview.propTypes = {
  lang: PropTypes.string.isRequired,
  thing: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  ).isRequired,
};

export default ServicePreview;
