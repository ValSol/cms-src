import React from 'react';
import { plural } from 'pluralize';
import FileDownloadIcon from 'material-ui/svg-icons/file/file-download';

import { getThingConfig, locales, params } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import FloatingAnimatedButton from '../../../components/FloatingAnimatedButton';
import ThingFormList from '../../../components/thingForms/ThingFormList';
import stickTheButton from '../../../components/HOCs/stickTheButton';
import authorize from '../../../components/HOCs/authorize';
import composeThings from '../composeThingsForList.gql';
import composeOnPressButton from './composeOnPressButton';

export default async (thingName, context) => {
  const { client, intl: { messages: allMessages }, locale } = context;
  const thingConfig = getThingConfig(thingName);
  const { messages, sideNavSections } = thingConfig;

  const thingsQuery = composeThings(thingConfig);

  const variables = locales.reduce((prev, lang) => {
    // eslint-disable-next-line no-param-reassign
    prev[lang] = lang === locale;
    return prev;
  }, {});
  const { data } = await client.query({
    query: thingsQuery,
    variables,
  });

  const queryName = plural(thingName.toLowerCase());
  if (!data || !data[queryName]) return null;
  const things = data[queryName];

  const title = allMessages[messages[`ExportOf${plural(thingName)}`].id];

  // добавляем плавающую кнопку поверх списка
  const ThingFormListWithButton = stickTheButton(
    ThingFormList,
    FloatingAnimatedButton,
    // чтобы получилось в результате ...
    // ... например: 'articleAddRoute' и 'ArticleListForm:button:add'
    {
      actionRouteNamePrefix: 'ExportRoute',
      Icon: FileDownloadIcon,
      idPrefix: 'ThingsExport:button',
      onPressButton: composeOnPressButton(thingConfig, context),
      secondaryColor: true,
    },
  );
  // HOC authorize используем последней чтобы отрабатывалась из всех HOC'ов первой
  // чтобы не заморачиваться с дальнейшими действиями если пользователь неавторизован
  const AuthorizedThingFormListWithButton = authorize(
    ThingFormListWithButton,
    'export',
  );

  return {
    title,
    chunks: ['admin'],
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <AuthorizedThingFormListWithButton
          thingConfig={thingConfig}
          things={things}
          params={params}
          query={context.query}
          title={title}
        />
      </Layout2>
    ),
  };
};
