import { AtomicBlockUtils, EditorState } from 'draft-js';
// функция устанавливает entity c заданными парамтрами для selection

const insertMediaBlock = (editorState, entityAttributes, selection) => {
  const currentContent = editorState.getCurrentContent();
  const { type, mutability, data } = entityAttributes;
  const contentWithEntity = currentContent.createEntity(type, mutability, data);
  const entityKey = contentWithEntity.getLastCreatedEntityKey();
  const options = { currentContent: contentWithEntity };
  // переустанавливаем selection если задается в аргументах (в случае dropped files)
  if (selection) options.selection = selection;

  const editorStateWithEntity = EditorState.set(editorState, options);
  const editorStateWithAtomicBlock = AtomicBlockUtils.insertAtomicBlock(
    editorStateWithEntity,
    entityKey,
    ' ',
  );

  return editorStateWithAtomicBlock;
};

export default insertMediaBlock;
