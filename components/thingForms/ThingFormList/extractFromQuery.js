// функция используется в ThingFormList и ...
// ... исходя из thingConfig и параметров строки браузера query
// определяет 3 переменных:
// 1) checked - включен ли режим упорядочивания вручную (перетаскиванием)
// 2) filters - значения задействованных фильтров, например: { subject: 'trademark' }
// 3) thereIsExcerpt - имеет ли место упорядочиваемая вручную выборка

import { filtersFromQuery } from '../../../core/utils';

const extractFromQuery = (thingConfig, params, query) => {
  const { orderedSets, paramFields } = thingConfig;
  // определяем показывать ли чекбокс включения-выключения ...
  // ... режима упорядочивания вручную
  const thingParams = paramFields.reduce(
    (prev, { name }) => ({ ...prev, [name]: params[name] }),
    {},
  );
  const filters = filtersFromQuery(query, thingParams);
  // определяем что выбранные фильтры полностью совпадают с каким лиюбо из
  // наборов полей-справочников из compoundIndexFieldSets
  const thereIsExcerpt = orderedSets.some(set =>
    set.every(name => filters[name]),
  );

  const { ordering } = query;
  const checked = ordering === null || ordering === '' || !!ordering;

  return {
    checked,
    filters,
    thereIsExcerpt,
  };
};

export default extractFromQuery;
