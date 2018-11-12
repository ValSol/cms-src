import React from 'react';

import Layout2 from '../../../components/Layout2';

import { getThingConfig } from '../../../appConfig';
import { packFields } from '../../../core/utils';
import { getDeletedThing } from '../utils';

export default async (thingName, headerTabs, { locale }) => {
  const thingConfig = getThingConfig(thingName);
  const { sideNavSections } = thingConfig;

  // если имеет место SSR рендерим Layout2 без ThingForm чтобы нормально ...
  // ... отрисовалась форма восстановления уже при повторном рендиге на сервере
  if (!process.env.BROWSER) {
    return {
      title: '',
      component: (
        <Layout2
          headerTabs={headerTabs}
          sideNavSections={sideNavSections}
          thingName={thingName}
        />
      ),
    };
  }

  const thing = getDeletedThing(thingConfig);

  // если данные по публикации не найдены
  if (!thing) return null;

  // пакуем thing чтобы получить удобный доступ к названию статьи
  // в текущей локали (packedThing.title[lang])
  const packedThing = packFields(thing, thingConfig);

  const title = packedThing.title[locale];

  const { ThingPreviewComponent } = thingConfig;
  // headerTabs - будут установлены в index.js
  // так как там уже есть разбор на предпросмотр для различных видов роутов
  return {
    title,
    component: (
      <Layout2
        headerTabs={headerTabs}
        sideNavSections={sideNavSections}
        thingName={thingName}
      >
        <ThingPreviewComponent lang={locale} thing={packedThing} />
      </Layout2>
    ),
  };
};
