import { loadState } from '../../../core/utils';

// получаем данные об удаленной публикации из localStorage
// ВНИМАНИЕ! функция используется только в бразуере ...
// ... process.env.BROWSER === true
const getDeletedThing = thingConfig => {
  const { thingName } = thingConfig;
  let thing;
  if (global.localStorage) {
    thing = loadState(`deleted${thingName}`);
  } else {
    thing = null;
  }

  // если в localStore статья не найдена или localStore отключен
  // делаем редирект на список статей
  return thing || null;
};

export default getDeletedThing;
