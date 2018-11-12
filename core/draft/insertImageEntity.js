import { EditorState, Modifier } from 'draft-js';
// функция вставляет inline img entity
// чтбы работала - необходимо чтобы...
// ... entity IMAGE была определена в editorStateDecorator

const insertImageEntity = (editorState, data) => {
  const currentContent = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const contentWithEntity = currentContent.createEntity(
    'IMAGE',
    'IMMUTABLE',
    data,
  );
  const entityKey = contentWithEntity.getLastCreatedEntityKey();

  // применям entity к  выделенному диапазону
  const contentWithAppliedEntities = Modifier.insertText(
    contentWithEntity,
    selectionState,
    ' ',
    null,
    entityKey,
  );

  const newEditorState = EditorState.set(editorState, {
    currentContent: contentWithAppliedEntities,
  });

  return EditorState.forceSelection(newEditorState, selectionState);
};

export default insertImageEntity;
