import url from 'url';
import isMongoId from 'validator/lib/isMongoId';

import { getThingConfig } from '../../../../appConfig';
import { composePathWithLocale } from '../../../../core/utils';
import router from '../../../../router';
import queryThingName from './thingName.gql';
import composeThingForPermaLinkById from './composeThingForPermaLinkById.gql';
// функция возвращает _id и thingName и href соответствующие указанным:
// 1) _id, например: '5ae21a8e052a9510946d4f4f'
// 2) полному url,
// например: http://localhost:3000/admin/articles/5ae21a8e052a9510946d4f4f/content
// 3) pathname, например: /admin/articles/5ae21a8e052a9510946d4f4f/content

// вспомогательная функция для определения пути по thingName, _id
const getPermanentPath = async (thingName, _id, context) => {
  const { client, locale } = context;
  // получаем параметры thing соответсвующей thingName и _id
  const thingConfig = getThingConfig(thingName);
  const { getThingPermanentPath } = thingConfig;
  // получаем нужные атрибуты для запроса
  const queryById = composeThingForPermaLinkById(thingConfig);
  const { data } = await client.query({
    query: queryById,
    variables: { _id },
  });
  const thing = data[`${thingName.toLowerCase()}`];
  // исходя из thing вычисялем соответствующий href
  return composePathWithLocale(getThingPermanentPath(thing), locale);
};

const getDataFromPath = async (linkValue, context) => {
  const { client } = context;

  if (isMongoId(linkValue)) {
    // если linkValue представляем собой строку похожую на _id
    // определяем соответсвующий thingName
    const { data: { thingName } } = await client.query({
      query: queryThingName,
      variables: { _id: linkValue },
    });
    if (thingName) {
      const href = await getPermanentPath(thingName, linkValue, context);
      return { href, _id: linkValue, thingName };
    }
  }

  // определяем _id и thingName исходя из linkValue - предполагая что это ...
  // ... адресная строка браузера
  const { pathname } = url.parse(linkValue);
  let route;
  try {
    route = await router.resolve({ ...context, pathname });
  } catch (err) {
    // если путь не соответствует никакому роуту и возникла ошибка 404 ...
    if (err.name === 'Error' && err.message === 'Page not found') {
      // ... возвращаем null для искомых значений
      return { _id: null, thingName: null, href: linkValue };
    }
    throw err;
  }
  const { _id, thingName } = route;

  // если указанному пути не соответствует никакой экземпляр thing
  // возвращаем null - значения
  if (!_id) {
    return { _id: null, thingName: null, href: pathname };
  }

  const href = await getPermanentPath(thingName, _id, context);
  return { href, _id, thingName };
};

export default getDataFromPath;
