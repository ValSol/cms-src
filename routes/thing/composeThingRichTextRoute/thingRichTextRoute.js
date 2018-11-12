import React from 'react';

import { getThingConfig } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import MultiLingualRichTextEditor from '../../../components/richTextComponents/MultiLingualRichTextEditor';

import { composePathWithLocale, unpackFields } from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';
import { addRichtexteditorData } from '../../../actions/richtexteditor';
import composeThingById from '../composeThingById.gql';

export default async (thingName, context) => {
  const thingConfig = getThingConfig(thingName);
  const {
    baseUrl,
    client,
    intl: { messages: allMessages },
    locale,
    params: { field, slug },
    pathname,
    ping,
    store,
  } = context;

  // если ping === true просто сообщаем какому экземляру какой thing
  // соответствует путь
  if (ping) return { _id: slug, thingName };

  const { messages, sideNavSections } = thingConfig;
  const thingQuery = composeThingById(thingConfig);
  const { data } = await client.query({
    query: thingQuery,
    variables: {
      _id: slug,
    },
  });
  // если данные для указанного слага не найдены
  // завершаем обработку роута
  if (!data || !data[thingName.toLowerCase()]) return null;

  // получаемые из apollo graphql запроса данные ОБЯЗАТЕЛЬНО
  // прогонять через unpackFields,
  // чтобы убрать __typename поля, которые инача будут препятствовать
  // выполнению запросов на сохранение измененных данных
  const thing = unpackFields(data[thingName.toLowerCase()], thingConfig);
  const { backLinks, title } = thing;

  // устанавливаем значения в redux-store которые будут использоваться ...
  // ... ниже на 2 ступени по дереву иерархии в richTextEditor компонентах
  // данные передаются через redux-store, а не props'ы так как совместно ...
  // используются в нескольких richTextEditor компонентах (по количествоу locales)
  // которые работают паралельно внося измненеия в общие данные
  store.dispatch(
    addRichtexteditorData({ richTextFieldName: field, thingConfig, thing }),
  );

  // определяем табуляцию
  // /admin/articles/1234567890/content
  const href0 = pathname;
  const headerTabs = [['Editing', href0, `${thingName}:update`]];

  // если имеются обратные ссылки
  // /admin/articles/backlinks/1234567890
  if (backLinks.length) {
    const absolutePathForBackLinks = getPathForRoute(
      baseUrl,
      `${thingName.toLowerCase()}BackLinksRoute`,
    );
    const pathForBackLinks = composePathWithLocale(
      absolutePathForBackLinks,
      locale,
    );
    const href1 = `${pathForBackLinks}/${slug}/${field}`;
    headerTabs.push(['BackLinks', href1, `${thingName}:update`]);
  }

  // /admin/articles/preview/1234567890/content
  const absolutePathForPreview = getPathForRoute(
    baseUrl,
    `${thingName.toLowerCase()}PreviewRoute`,
  );
  const pathForPreview = composePathWithLocale(absolutePathForPreview, locale);
  const href2 = `${pathForPreview}/${slug}/${field}`;
  headerTabs.push(['Preview', href2]);

  const title1stPart =
    allMessages[messages[`EditingThe${thingName}RichText`].id];
  const title2ndPart = title[locale];
  return {
    chunks: ['admin'],
    title: `${title1stPart}: ${title2ndPart}`,
    component: (
      <Layout2
        headerTabs={headerTabs}
        sideNavSections={sideNavSections}
        thingName={thingName}
        withoutPaper
      >
        <MultiLingualRichTextEditor
          richTextFieldName={field}
          // из всех атрибутов thing компонента будет ...
          // ... использовать только _id и title
          thing={thing}
          thingConfig={thingConfig}
        />
      </Layout2>
    ),
  };
};
