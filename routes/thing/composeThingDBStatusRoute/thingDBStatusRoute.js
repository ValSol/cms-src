import React from 'react';
import { graphql } from 'react-apollo';
import { plural } from 'pluralize';

import { getThingConfig } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import ThingDBStatus from './components/ThingDBStatus';
import composeOnPressButton from './composeOnPressButton';
import composeThingsStatus from './composeThingsStatus.gql';

export default async (thingName, context) => {
  const { intl: { messages: allMessages } } = context;
  const thingConfig = getThingConfig(thingName);
  const { messages, sideNavSections } = thingConfig;

  const thingsStatusQuery = composeThingsStatus(thingConfig);
  const ThingDBStatusWithData = graphql(thingsStatusQuery)(ThingDBStatus);

  const title = allMessages[messages[`StatusOf${plural(thingName)}`].id];

  return {
    title,
    chunks: ['admin'],
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <ThingDBStatusWithData
          fixThings={composeOnPressButton(thingConfig, context)}
          thingConfig={thingConfig}
          title={title}
        />
      </Layout2>
    ),
  };
};
