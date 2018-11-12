import { EditorState, Modifier } from 'draft-js';
// функция убирает все entities в заданном диапазоне

const unsetEntitiesInSelection = editorState => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  // убираем все entities в выделенном диапазоне
  const contentStateWithoutEntities = Modifier.applyEntity(
    contentState,
    selectionState,
    null,
  );

  // обновляем состояение редактора (editorState) устанавливая новый контент
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithoutEntities,
  });

  // обновляем выделение в измененном состоянии редактора (editorState)
  return EditorState.forceSelection(newEditorState, selectionState);
};

export default unsetEntitiesInSelection;
