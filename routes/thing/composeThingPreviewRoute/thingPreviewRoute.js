import React from 'react';

import { getThingConfig, locales } from '../../../appConfig';
import { composePathWithLocale, unpackFields } from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';
import Layout2 from '../../../components/Layout2';

import composeThingById from './composeThingByIdForPreview.gql';

export default async (thingName, headerTabs, context) => {
  const { baseUrl, client, params: { slug, field }, ping, locale } = context;
  const thingConfig = getThingConfig(thingName);
  const { sideNavSections, ThingPreviewComponent } = thingConfig;

  // если ping === true просто сообщаем какому экземляру какой thing
  // соответствует путь
  if (ping) return { _id: slug, thingName };

  const query = composeThingById(thingConfig);
  const variables = locales.reduce(
    (prev, lang) => {
      // eslint-disable-next-line no-param-reassign
      prev[lang] = lang === locale;
      return prev;
    },
    { _id: slug },
  );
  const { data } = await client.query({
    query,
    variables,
  });

  // если данные для указанного слага не найдены
  // завершаем обработку роута
  if (!data || !data[thingName.toLowerCase()]) return null;

  const thing = unpackFields(data[thingName.toLowerCase()], thingConfig);
  const { backLinks, title } = thing;

  // headerTabs - будут установлены в index.js
  // так как там уже есть разбор на предпросмотр для различных видов роутов

  // если предпросмотр при редактировании thing проверяем  backLinks ...
  // ... добавляем вкладку для обратных ссылок
  if (headerTabs[0][0] === 'Editing') {
    if (backLinks.length) {
      const absolutePathForBackLinks = getPathForRoute(
        baseUrl,
        `${thingName.toLowerCase()}BackLinksRoute`,
      );
      const pathForBackLinks = composePathWithLocale(
        absolutePathForBackLinks,
        locale,
      );
      const href = field
        ? `${pathForBackLinks}/${slug}/${field}`
        : `${pathForBackLinks}/${slug}`;
      headerTabs.splice(1, 0, ['BackLinks', href, `${thingName}:update`]);
    }
  }

  // eslint-disable-next-line no-underscore-dangle
  return {
    title: title[locale],
    component: (
      <Layout2
        headerTabs={headerTabs}
        sideNavSections={sideNavSections}
        thingName={thingName}
      >
        <ThingPreviewComponent
          lang={locale}
          thing={data[thingName.toLowerCase()]}
        />
      </Layout2>
    ),
  };
};
