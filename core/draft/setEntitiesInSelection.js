import { EditorState, Modifier } from 'draft-js';
import deepEqual from 'deep-equal';
// функция устанавливает entity c заданными парамтрами для selection

import getAllEntities from './getAllEntities';

const setEntitiesInSelection = (editorState, entityAttributes) => {
  const { type, mutability, data } = entityAttributes;
  const currentContent = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  // !!! в следующей версии draft.js использовать .getEntityMap()
  // вместо allEntities
  // проверяем не создана ли уже entity c таким data ...
  const allEntities = getAllEntities(currentContent, type);
  // ... при этом mutability НЕ сравниваем (пока не надо)
  const alreadyCreatedEntity = allEntities.find(({ entityKey }) => {
    const entity = currentContent.getEntity(entityKey);
    return deepEqual(data, entity.getData());
  });

  let contentWithEntity;
  let entityKey;

  if (alreadyCreatedEntity) {
    // если entity уже был задан используем то что есть
    contentWithEntity = currentContent;
    // eslint-disable-next-line prefer-destructuring
    entityKey = alreadyCreatedEntity.entityKey;
  } else {
    // если entity НЕ был задан создаем entity c заданными параметрами
    contentWithEntity = currentContent.createEntity(type, mutability, data);
    entityKey = contentWithEntity.getLastCreatedEntityKey();
  }
  // применям entity к выделенному диапазону
  const contentWithAppliedEntities = Modifier.applyEntity(
    contentWithEntity,
    selectionState,
    entityKey,
  );

  // обновляем состояение редактора (editorState) устанавливая новый контент
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentWithAppliedEntities,
  });

  // обновляем выделение в измененном состоянии редактора (editorState)
  return EditorState.forceSelection(newEditorState, selectionState);
};

export default setEntitiesInSelection;
