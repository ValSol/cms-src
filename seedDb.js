import Promise from 'bluebird';
import { plural } from 'pluralize';

import { getThingConfig, thingNames } from './appConfig';
import createApolloClient from './core/createApolloClient';
import schema from './data/schema';
import { getThingModel } from './data/mongooseModels';
import composeThingsImport from './core/gql/composeThingsImport.gql';

// функция обеспечивает загрузку первоначальных данных (seed) для каждой из things
// если в безе данных нет соотвтетствующих данных И файл с seed данными в наличии

const seedDb = async () => {
  // создаем apolloClient для выполнения запроса на СЕРВЕРНОЙ стороне
  const client = createApolloClient({
    schema,
    // синтезируем rootValue для разрешения выполнения мутации importThings
    // на серверной стороне
    rootValue: { request: { serverSideRendering: true } },
  });

  const promises = thingNames.map(thingName => getThingModel(thingName));
  const Things = await Promise.all(promises);

  // проверям заполненность things-коллекций
  const promises2 = Things.map(Thing => Thing.count());
  const counts = await Promise.all(promises2);

  // отфильтровываем только те thingNames для которых нет данных коллекций и ...
  // ... для которых потребуется выполнить импорт
  const thingNames2 = thingNames.filter((thingName, i) => !counts[i]);

  // получаем массив промисов которые "обещают" выполнить мутации по импорту
  const promises3 = thingNames2.map(thingName => {
    const thingConfig = getThingConfig(thingName);
    const thingName2 = thingName.toLowerCase();
    const mutation = composeThingsImport(thingConfig);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const seed = require(`./appConfig/Things/seeds/${thingName.toLowerCase()}Seed.json`);
    return client.mutate({
      mutation,
      variables: {
        excerpts: seed[`${thingName2}_excerpts`],
        things: seed[plural(thingName2)],
      },
    });
  });
  // выполняем мутации импорта данных
  await Promise.all(promises3);
  if (promises3.length) {
    // чистим кеш запросов и повторно выполяняем все АКТИВНЫЕ запросы
    // (запросы на результатах которых строятся какие-то текущие компоненты)
    await client.resetStore();
  }
};

export default seedDb;
