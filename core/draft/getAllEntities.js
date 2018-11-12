// функция возвращает перечень всех entities
// немного переделано из взятого здесь: https://github.com/facebook/draft-js/issues/1236

const getAllEntities = (content, entityType = null) => {
  const entities = [];
  content.getBlocksAsArray().forEach(block => {
    let selectedEntity = null;
    block.findEntityRanges(
      // фильтрующая функция которая обрабатывает каждый символ и определяет
      // принадлежность этого символа конкретной entity
      character => {
        if (character.getEntity() !== null) {
          const entity = content.getEntity(character.getEntity());
          if (!entityType || (entityType && entity.getType() === entityType)) {
            selectedEntity = {
              entityKey: character.getEntity(),
              blockKey: block.getKey(),
              entity: content.getEntity(character.getEntity()),
            };
            return true;
          }
        }
        return false;
      },
      // callback функция которая получает в качестве аргументов
      // начало(start) и конец(end) найденной entity и сохраняет entity ...
      // ... в списке entities
      (start, end) => {
        entities.push({ ...selectedEntity, start, end });
      },
    );
  });
  return entities;
};

export default getAllEntities;
