import Promise from 'bluebird';
import { plural } from 'pluralize';

import { params } from '../../../appConfig';
import {
  filtersFromQuery,
  filterObjectsByParams,
  removeKeysFromObject,
} from '../../../core/utils';
import { setRuntimeVariable } from '../../../actions/runtime';
import sortThingListItems from '../../../components/thingForms/ThingFormList/sortThingListItems';
import composeThingsByParams from './composeThingsByParams.gql';
import composeThingExcerpts from './composeThingExcerpts.gql';

const composeOnPressButton = (thingConfig, context) => async () => {
  const { paramFields, thingName } = thingConfig;
  const { client, query, store } = context;

  // определяем перечень возможных значений параметров
  const thingParams = paramFields.reduce(
    (prev, { name }) => ({ ...prev, [name]: params[name] }),
    {},
  );
  // определяем выбранные пользователем параметры отбора из строки query браузера
  const variables = filtersFromQuery(query, thingParams);

  // формируем массив qgl запросов
  const promises = [];

  // добавляем в массив промисов запрос требуемых things
  const thingsQuery = composeThingsByParams(thingConfig);
  promises.push(client.query({ query: thingsQuery, variables }));

  // добавляем в массив промисов запрос выборок
  const excerptsQuery = composeThingExcerpts(thingConfig);
  promises.push(client.query({ query: excerptsQuery }));

  // выполняем массив qgl запросов
  let resultOfQueries;
  try {
    resultOfQueries = await Promise.all(promises);
    store.dispatch(setRuntimeVariable({ name: 'error', value: '' }));
  } catch (err) {
    // если при выполнении запросов случились какие-то ошибки - выходим ...
    // ... установив в store информацию об ошибке
    return store.dispatch(
      setRuntimeVariable({
        name: 'error',
        value: 'DataProcessingFailure',
      }),
    );
  }

  const [{ data }, { data: { excerpts } }] = resultOfQueries;

  const queryName = plural(thingName.toLowerCase());
  const things = data[queryName];
  // сортируем полученные элементы получив порядок сортировки из query
  const sortedThings = sortThingListItems(thingConfig, things, query);
  // удаляем ненужные служебные поля (keyNames)
  const keyNames = ['updated', 'created', '__typename'];
  const clearedThings = removeKeysFromObject(sortedThings, keyNames);

  // фильтруем полученные выборки в соответствии с отобранными things
  const filteredExcerpts = filterObjectsByParams(
    thingConfig,
    excerpts,
    variables,
  );
  const clearedExcerpts = removeKeysFromObject(filteredExcerpts, [
    '__typename',
  ]);

  // формируем результирующий объект
  const result = {
    info: variables,
    [queryName]: clearedThings,
    [`${thingName.toLowerCase()}_excerpts`]: clearedExcerpts,
  };
  // формируем блоб содержащий экспортированные данные
  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: 'application/json',
  });

  const objectURL = URL.createObjectURL(blob);

  // конструируем имя файла
  const now = new Date();
  const fileName = `${plural(thingName)} ${now.toISOString()}`;
  // формируем ссылку для открытия
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.href = objectURL;
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  link.click();
  link.remove();
  // освобождаем ссылку на объект
  URL.revokeObjectURL(objectURL);
  return true; // чтобы уравновесть 'return' в конструкции try ... catch
};

export default composeOnPressButton;
