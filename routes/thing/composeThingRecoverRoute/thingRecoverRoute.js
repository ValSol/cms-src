/* eslint-disable no-underscore-dangle */
import React from 'react';

import { getThingConfig } from '../../../appConfig';
import { composePathWithLocale, packFields } from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';
import Layout2 from '../../../components/Layout2';
import ThingForm from '../../../components/thingForms/ThingForm';
import { getDeletedThing } from '../utils';

import composeOnSubmitHandler from './composeOnSubmitHandler';

export default (thingName, context) => {
  // если отображаем удаленную статью
  const thingConfig = getThingConfig(thingName);
  const {
    client,
    intl: { messages: allMessages },
    baseUrl,
    pathname,
    locale,
  } = context;
  const { messages, sideNavSections } = thingConfig;

  // определяем табуляцию
  // /admin/articles/deleted
  const href0 = pathname;
  // /admin/articles/deleted/preview
  const absolutePathForPreview = getPathForRoute(
    baseUrl,
    `${thingName.toLowerCase()}PreviewRoute`,
  );
  const pathForPreview = composePathWithLocale(absolutePathForPreview, locale);

  const href1 = pathForPreview;
  const headerTabs = [
    ['Recovering', href0, `${thingName}:recover`],
    ['Preview', href1],
  ];

  const chunks = ['admin'];

  // 1-я часть title используется как и в ssr рендинге и в отрисовке в браузере
  const title1stPart = allMessages[messages[`RecoveringThe${thingName}`].id];

  // если имеет место SSR рендерим Layout2 без ThingForm чтобы нормально ...
  // ... отрисовалась форма восстановления уже при повторном рендиге на сервере
  if (!process.env.BROWSER) {
    return {
      chunks,
      title: title1stPart,
      component: (
        <Layout2
          headerTabs={headerTabs}
          sideNavSections={sideNavSections}
          thingName={thingName}
        />
      ),
    };
  }

  // получаем ее содержимое из localStorage (только для браузера)

  const thing = getDeletedThing(thingConfig);
  // если localStore статья не найдена
  // делаем редирект на список статей ???
  if (!thing) return null;

  // пакуем article чтобы получить удобный доступ к названию статьи
  // в текущей локали (packedArticle.title[lang])
  const packedThing = packFields(thing, thingConfig);

  // для корректного перехода от одной подобной формы к другой
  // на приме от 'ArticleForm:delete' к 'ArticleForm:recover'
  // обязательно передвать в пропсах: key={form} и form={form}
  const form = `${thingName}Form:recover`;
  const title2ndPart = packedThing.title[locale];
  return {
    chunks,
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
