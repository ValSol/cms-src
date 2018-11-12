/* eslint-disable no-underscore-dangle */
import React from 'react';

import { getThingConfig, locales, thingNames } from '../../../appConfig';
import { composePathWithLocale } from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';
import Layout2 from '../../../components/Layout2';
import ThingFormList from '../../../components/thingForms/ThingFormList';
import authorize from '../../../components/HOCs/authorize';
import composeThingByIdForBackLinks from './composeThingByIdForBackLinks.gql';
import composeThingBackLinks from './composeThingBackLinks.gql';

export default async (thingName, context) => {
  const thingConfig = getThingConfig(thingName);
  const { i18nFields, messages, sideNavSections } = thingConfig;
  const {
    baseUrl,
    client,
    intl: { messages: allMessages },
    locale,
    ping,
    params: { slug, field },
    pathname,
  } = context;

  // если ping === true просто сообщаем какому экземляру какой thing
  // соответствует путь
  if (ping) return { _id: slug, thingName };

  const queryThing = composeThingByIdForBackLinks(thingConfig);
  const queryBackLinks = composeThingBackLinks(thingConfig);

  const variables = locales.reduce(
    (prev, lang) => {
      // eslint-disable-next-line no-param-reassign
      prev[lang] = lang === locale;
      return prev;
    },
    { _id: slug },
  );

  // получаем title и backLinks для thing
  const { data } = await client.query({
    query: queryThing,
    variables,
  });

  // если данные для указанного слага не найдены
  // завершаем обработку роута
  const queryName = thingName.toLowerCase();
  if (!data || !data[queryName]) return null;

  const thing = data[queryName];
  // если обратные ссылки отсутствуют - выходим
  if (thing.backLinks && !thing.backLinks.length) return null;

  // получаем ЗАПОЛНЕННЫЕ (populated) backLinks для thing
  const { data: data2 } = await client.query({
    query: queryBackLinks,
    variables,
  });

  // если данные для указанного слага не найдены
  // завершаем обработку роута
  const queryName2 = `${thingName.toLowerCase()}BackLinks`;
  if (!data2 || !data2[queryName2]) return null;

  const backLinks = data2[queryName2];

  // определяем табуляцию
  let href0;
  if (field) {
    // /admin/articles/1234567890/content
    const absolutePathForRichText = getPathForRoute(
      baseUrl,
      `${queryName}RichTextRoute`,
    );
    const pathForRichText = composePathWithLocale(
      absolutePathForRichText,
      locale,
    );
    href0 = `${pathForRichText}/${slug}/${field}`;
  } else {
    // /admin/articles/1234567890
    const absolutePathForUpdate = getPathForRoute(
      baseUrl,
      `${queryName}UpdateRoute`,
    );
    const pathForUpdate = composePathWithLocale(absolutePathForUpdate, locale);
    href0 = `${pathForUpdate}/${slug}`;
  }
  const headerTabs = [['Editing', href0, `${thingName}:update`]];

  const href1 = pathname;
  headerTabs.push(['BackLinks', href1]);

  // /admin/articles/preview/1234567890
  const absolutePathForPreview = getPathForRoute(
    baseUrl,
    `${queryName}PreviewRoute`,
  );
  const pathForPreview = composePathWithLocale(absolutePathForPreview, locale);
  const href2 = field
    ? `${pathForPreview}/${slug}/${field}`
    : `${pathForPreview}/${slug}`;
  headerTabs.push(['Preview', href2]);

  const title1stPart = allMessages[messages[`BackLinksOfThe${thingName}`].id];
  const title2ndPart = data[queryName].title[locale];

  // HOC authorize используем последней чтобы отрабатывалась из всех HOC'ов первой
  // чтобы не заморачиваться с дальнейшими действиями если пользователь неавторизован
  const AuthorizedThingFormList = authorize(ThingFormList, 'update');

  // ---------------------------------------------------------------------------
  // создаем синтетический thingConfig чтобы отображался список ...
  // ... отбратных ссылок (backLinks) c фильтрацией по thingName и ...
  // ... сортировкой

  const paramFields = [
    {
      name: '__typename',
      multiple: false,
      required: true,
    },
  ];
  const orderedSets = [];
  const sortingOptions = [
    {
      name: 'created',
      template: ['-created'],
    },
    {
      name: 'edited',
      template: ['-updated'],
      default: true,
    },
  ];
  const defaultSortingOptionName = 'edited';
  const thingConfig2 = {
    i18nFields,
    defaultSortingOptionName,
    orderedSets,
    paramFields,
    sortingOptions,
    thingName,
  };

  const __typename = thingNames.map(name => `${name}Type`);
  const params2 = { __typename };

  return {
    chunks: ['admin'],
    title: `${title1stPart}: ${title2ndPart}`,
    component: (
      <Layout2
        headerTabs={headerTabs}
        sideNavSections={sideNavSections}
        thingName={thingName}
      >
        <AuthorizedThingFormList
          things={backLinks}
          params={params2}
          query={context.query}
          thingConfig={thingConfig2}
          title={title1stPart}
        />
      </Layout2>
    ),
  };
};
