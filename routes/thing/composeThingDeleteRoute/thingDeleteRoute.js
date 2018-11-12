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
  const thingConfig = getThingConfig(thingName);
  const { messages, sideNavSections } = thingConfig;
  const {
    baseUrl,
    client,
    intl: { messages: allMessages },
    locale,
    ping,
    params: { slug },
    pathname,
  } = context;

  // если ping === true просто сообщаем какому экземляру какой thing
  // соответствует путь
  if (ping) return { _id: slug, thingName };

  const queryById = composeThingById(thingConfig);

  const { data } = await client.query({
    query: queryById,
    variables: {
      _id: slug,
    },
  });

  // если данные для указанного слага не найдены
  // завершаем обработку роута
  if (!data || !data[`${thingName.toLowerCase()}`]) return null;

  const thing = unpackFields(data[`${thingName.toLowerCase()}`], thingConfig);
  // извлекаем __typename чтобы не путался
  // eslint-disable-next-line no-unused-vars
  delete thing.__typename;

  // определяем табуляцию
  // /admin/articles/1234567890
  const href0 = pathname;
  // /admin/articles/preview/1234567890
  const absolutePathForPreview = getPathForRoute(
    baseUrl,
    `${thingName.toLowerCase()}PreviewRoute`,
  );
  const pathForPreview = composePathWithLocale(absolutePathForPreview, locale);

  const href1 = `${pathForPreview}/${slug}`;
  const headerTabs = [
    ['Deleting', href0, `${thingName}:delete`],
    ['Preview', href1],
  ];

  // для корректного перехода от одной подобной формы к другой
  // на пример от 'ArticleForm:delete' к 'ArticleForm:recover'
  // обязательно передвать в пропсах: key={form} и form={form}
  const form = `${thingName}Form:delete`;
  const title1stPart = allMessages[messages[`DeletingThe${thingName}`].id];
  const title2ndPart = data[thingName.toLowerCase()].title[locale];
  return {
    chunks: ['admin'],
    title: `${title1stPart}: ${title2ndPart}`,
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
