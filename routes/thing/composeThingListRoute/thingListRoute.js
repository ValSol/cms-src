import React from 'react';
import { plural } from 'pluralize';
import ContentAddIcon from 'material-ui/svg-icons/content/add';

import { getThingConfig, locales, params } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import FloatingAnimatedButton from '../../../components/FloatingAnimatedButton';
import ThingFormList from '../../../components/thingForms/ThingFormList';
import stickTheButton from '../../../components/HOCs/stickTheButton';
import authorize from '../../../components/HOCs/authorize';
import composeThings from '../composeThingsForList.gql';

export default async (thingName, context) => {
  const { client, intl: { messages: allMessages }, locale } = context;
  const thingConfig = getThingConfig(thingName);
  const { messages, sideNavSections } = thingConfig;

  const query = composeThings(thingConfig);

  const variables = locales.reduce((prev, lang) => {
    // eslint-disable-next-line no-param-reassign
    prev[lang] = lang === locale;
    return prev;
  }, {});
  const { data } = await client.query({
    query,
    variables,
  });
  // если данные для указанного запроса не найдены
  // завершаем обработку роута
  const queryName = plural(thingName.toLowerCase());
  if (!data || !data[queryName]) return null;
  const things = data[queryName];

  const title = allMessages[messages[`ListOf${plural(thingName)}`].id];

  // добавляем плавающую кнопку поверх списка
  const ThingFormListWithButton = stickTheButton(
    ThingFormList,
    FloatingAnimatedButton,
    // чтобы получилось в результате ...
    // ... например: 'articleAddRoute' и 'ArticleListForm:button:add'
    {
      actionRouteNamePrefix: 'AddRoute',
      Icon: ContentAddIcon,
      idPrefix: 'ListForm:button:add',
      secondaryColor: true,
    },
  );
  // HOC authorize используем последней чтобы отрабатывалась из всех HOC'ов первой
  // чтобы не заморачиваться с дальнейшими действиями если пользователь неавторизован
  const AuthorizedThingFormListWithButton = authorize(
    ThingFormListWithButton,
    'update',
  );

  return {
    title,
    chunks: ['admin'],
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <AuthorizedThingFormListWithButton
          things={things}
          dragAndDropOrdering
          params={params}
          query={context.query}
          thingConfig={thingConfig}
          title={title}
          useOrderlinessSortOption
        />
      </Layout2>
    ),
  };
};
