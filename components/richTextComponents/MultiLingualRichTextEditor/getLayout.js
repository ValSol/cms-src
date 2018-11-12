import { locales } from '../../../appConfig';
import { loadState } from '../../../core/utils';
import getInitialLayout from './getInitialLayout';
// функция возвращает layout взятый из LocalStore
// а если LocalStore пустой =  зависимости от размера экрана

const getLayout = (mediaType, thingConfig) => {
  const { thingName } = thingConfig;
  const layout = loadState(`${mediaType}:${thingName}ContentEditorGridLayout`);
  // если layout был сохранен
  let minW;
  if (layout) {
    switch (mediaType) {
      case 'extraSmall':
        minW = 12;
        break;
      case 'small':
        minW = 12;
        break;
      case 'medium':
        minW = 12;
        break;
      case 'large':
        minW = 6;
        break;
      case 'extraLarge':
        minW = 6;
        break;
      default:
        minW = 4;
    }
    const result = {};
    locales.forEach((locale, i) => {
      const { x, y, w } = layout[i];
      // при этом 1) устанавливаем h = 1, чтобы отличать layout
      // сохраненный в LocalStore, от обычного,
      // затем h автоматически откорректируется чтобы вместить контент
      // 2) устанавливаем ширину на случай если она слишком узкая
      result[`${locale}Layout`] = {
        x,
        y,
        w: w < minW ? minW : w,
        h: 1,
      };
    });
    return result;
  }
  // если layout НЕ был сохранен
  return getInitialLayout(mediaType);
};

export default getLayout;
