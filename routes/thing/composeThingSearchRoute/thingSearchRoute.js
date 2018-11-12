import React from 'react';

import { getThingConfig } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import ThingSearchList from '../../../components/thingSearch/ThingSearchList';
import {
  composeListForContentSearch,
  wrapWithData,
} from '../../../components/thingSearch/utils';
import messages from '../../../components/thingSearch/searchMessages';

export default async (thingName, context) => {
  const {
    intl: { messages: allMessages },
    query: { q },
    locale,
    pathname,
  } = context;
  const thingConfig = getThingConfig(thingName);

  const { sideNavSectionsForContent } = thingConfig;

  // оборачиваем компоненнту в HOC обеспечивающий выполнения запроса на поиск
  const ThingSearchListWithData = wrapWithData(
    thingConfig,
    context,
    ThingSearchList,
  );

  const title = `${allMessages[messages.SearchFor.id]}: ${q}`;

  return {
    pathname,
    chunks: ['admin'],
    sideNavSections: sideNavSectionsForContent,
    title,
    component: (
      <Layout2
        sideNavSections={sideNavSectionsForContent}
        thingName={thingName}
      >
        <ThingSearchListWithData
          key={`Search${thingName}:${locale}`}
          // такой key чтобы переключался поиск при смене языка
          composeListItems={composeListForContentSearch}
          thingConfig={thingConfig}
        />
      </Layout2>
    ),
  };
};
