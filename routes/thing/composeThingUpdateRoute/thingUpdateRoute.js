/* eslint-disable no-underscore-dangle */
import React from 'react';

import { getThingConfig } from '../../../appConfig';
import { composePathWithLocale, unpackFields } from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';
import Layout2 from '../../../components/Layout2';
import ThingForm from '../../../components/thingForms/ThingForm';
import composeThingById from '../composeThingById.gql';

import composeOnSubmitHandler from './composeOnSubmitHandler';

export default async (thingName, context) => {
  // если редактируем существующую thing
  const thingConfig = getThingConfig(thingName);
  const {
    baseUrl,
    client,
    intl: { messages: allMessages },
    locale,
    params: { slug },
    pathname,
    ping,
  } = context;

  // если ping === true просто сообщаем какому экземляру какой thing
  // соответствует путь
  if (ping) return { _id: slug, thingName };

  const thingQuery = composeThingById(thingConfig);

  const { data } = await client.query({
    query: thingQuery,
    variables: {
      _id: slug,
    },
  });
  const { messages, sideNavSections } = thingConfig;

  // если данные для указанного слага не найдены
  // завершаем обработку роута
  if (!data || !data[thingName.toLowerCase()]) return null;

  const thing = unpackFields(data[thingName.toLowerCase()], thingConfig);
  const { backLinks } = thing;

  // определяем табуляцию
  // /admin/articles/1234567890
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
    const href1 = `${pathForBackLinks}/${slug}`;
    headerTabs.push(['BackLinks', href1, `${thingName}:update`]);
  }

  // /admin/articles/preview/1234567890
  const absolutePathForPreview = getPathForRoute(
    baseUrl,
    `${thingName.toLowerCase()}PreviewRoute`,
  );
  const pathForPreview = composePathWithLocale(absolutePathForPreview, locale);
  const href2 = `${pathForPreview}/${slug}`;
  headerTabs.push(['Preview', href2]);

  // для корректного перехода от одной подобной формы к другой
  // например от 'ArticleForm:add' к 'ArticleForm:update'
  // обязательно передавать в пропсах: key={form} и form={form}
  const form = `${thingName}Form:update`;
  const title1stPart = allMessages[messages[`EditingThe${thingName}`].id];
  const title2ndPart = data[thingName.toLowerCase()].title[locale];
  return {
    chunks: ['admin'],
    title: `${title1stPart}: ${title2ndPart}`,
    // prop client - передается для использования в asyncValidate
    component: (
      <Layout2
        headerTabs={headerTabs}
        sideNavSections={sideNavSections}
        thingName={thingName}
      >
        <ThingForm
          key={form}
          client={client}
          thingConfig={thingConfig}
          form={form}
          initialValues={thing}
          onSubmit={composeOnSubmitHandler(thingConfig)}
        />
      </Layout2>
    ),
  };
};
