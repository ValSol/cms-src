import React from 'react';
import { plural } from 'pluralize';
import FileUploadIcon from 'material-ui/svg-icons/file/file-upload';

import { getThingConfig } from '../../../appConfig';
import FloatingAnimatedButton from '../../../components/FloatingAnimatedButton';
import stickTheButton from '../../../components/HOCs/stickTheButton';
import authorize from '../../../components/HOCs/authorize';
import Layout2 from '../../../components/Layout2';
import ThingsImport from './components/ThingsImport';
import composeOnPressButton from './composeOnPressButton';

export default async (thingName, context) => {
  const { intl: { messages: allMessages } } = context;
  const thingConfig = getThingConfig(thingName);
  const { messages, sideNavSections } = thingConfig;

  const title = allMessages[messages[`ImportOf${plural(thingName)}`].id];

  // добавляем плавающую кнопку поверх списка
  const ThingsImportWithButton = stickTheButton(
    ThingsImport,
    FloatingAnimatedButton,
    // чтобы получилось в результате ...
    // ... например: 'articleAddRoute' и 'ArticleListForm:button:add'
    {
      actionRouteNamePrefix: 'ImportRoute',
      Icon: FileUploadIcon,
      idPrefix: 'ThingsImport:button',
      onPressButton: composeOnPressButton(thingConfig, context),
      secondaryColor: true,
    },
  );
  // HOC authorize используем последней чтобы отрабатывалась из всех HOC'ов первой
  // чтобы не заморачиваться с дальнейшими действиями если пользователь неавторизован
  const AuthorizedThingsImportWithButton = authorize(
    ThingsImportWithButton,
    'import',
  );

  return {
    title,
    chunks: ['admin'],
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <AuthorizedThingsImportWithButton
          thingConfig={thingConfig}
          title={title}
        />
      </Layout2>
    ),
  };
};
