import { CompositeDecorator } from 'draft-js';

import LinkEntity from './components/LinkEntity';
import ImageEntity from './components/ImageEntity';
// декоратор для draft-js состояние контента

// -----------------------------------------------------------------------

// возвращает метод для поиска в блоке entity соответствующего типа (entityType)
// например 'LINK', 'IMAGE' и т.п.
const findEntities = entityType => (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === entityType
    );
  }, callback);
};

// -----------------------------------------------------------------------

const decorator = new CompositeDecorator([
  {
    strategy: findEntities('LINK'),
    component: LinkEntity,
  },
  {
    strategy: findEntities('IMAGE'),
    component: ImageEntity,
  },
]);

export default decorator;
