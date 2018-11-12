// функция возвращает перечень всех entities ...
// ... попадающих в выделенный диапазон

const getEntitiesInSelection = (editorState, entityType = null) => {
  const selectionState = editorState.getSelection();
  const currentContent = editorState.getCurrentContent();

  const endKey = selectionState.getEndKey();

  let currentKey = selectionState.getStartKey();
  let currentContentBlock = currentContent.getBlockForKey(currentKey);
  let currentStart = selectionState.getStartOffset();
  let currentEnd =
    currentKey === endKey
      ? selectionState.getEndOffset()
      : currentContentBlock.getLength();

  // список для хранения отобраннх entities
  const entities = [];

  // в бесконечном цикле перебираем все блоки попадающие в выделении
  for (;;) {
    let selectedEntity = null;
    currentContentBlock.findEntityRanges(
      // фильтрующая функция которая обрабатывает каждый символ и определяет
      // принадлежность этого символа конкретной entity
      // eslint-disable-next-line no-loop-func
      character => {
        if (character.getEntity() !== null) {
          const entity = currentContent.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: currentContentBlock.getKey(),
              entity: currentContent.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      // callback функция которая получает в качестве аргументов
      // начало(start) и конец(end) найденной entity и сохраняет entity ...
      // ... в списке entities
      // eslint-disable-next-line no-loop-func
      (start, end) => {
        if (!(end < currentStart || start > currentEnd)) {
          entities.push({ ...selectedEntity, start, end });
        }
      },
    );
    // если текущий только-что обработанный блок - последний - выходим из цикла
    if (currentKey === endKey) break;
    // получаем следующий блок и соответствующие ему параметры
    currentKey = currentContent.getKeyAfter(currentKey);
    currentContentBlock = currentContent.getBlockForKey(currentKey);
    currentStart = 0;
    currentEnd =
      currentKey === endKey
        ? selectionState.getEndOffset()
        : currentContentBlock.getLength();
  }
  return entities;
};

export default getEntitiesInSelection;
