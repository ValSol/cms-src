import React from 'react';

import { getThingConfig } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import ThingSearchList from '../../../components/thingSearch/ThingSearchList';
import {
  composeListForFormSearch,
  wrapWithData,
} from '../../../components/thingSearch/utils';
import authorize from '../../../components/HOCs/authorize';
import messages from '../../../components/thingSearch/searchMessages';

export default async (thingName, context) => {
  const { intl: { messages: allMessages }, locale, query: { q } } = context;

  const thingConfig = getThingConfig(thingName);
  const { sideNavSections } = thingConfig;

  // оборачиваем компоненнту в HOC обеспечивающий выполнения запроса на поиск
  const ThingSearchListWithData = wrapWithData(
    thingConfig,
    context,
    ThingSearchList,
  );

  const AuthorizedThingSearchList = authorize(
    ThingSearchListWithData,
    'update',
  );

  const title = `${allMessages[messages.SearchFor.id]}: ${q}`;

  return {
    chunks: ['admin'],
    title,
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <AuthorizedThingSearchList
          // такой key чтобы переключался поиск при смене языка
          key={`Search${thingName}:${locale}`}
          composeListItems={composeListForFormSearch}
          thingConfig={thingConfig}
        />
      </Layout2>
    ),
  };
};
