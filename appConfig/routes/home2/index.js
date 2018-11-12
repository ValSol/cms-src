import React from 'react';

import { appName, getThingConfig, thingNames } from '../../index';
import Layout2 from '../../../components/Layout2';
import Home from './components/Home';

export default {
  path: '',

  action(context) {
    const { baseUrl, locale, ping } = context;

    // если ping === true просто сообщаем НИКАКОМУ конкретному экземляру thing
    // обрабатываемый путь не соответствует
    if (ping) return null;

    // нужна locale используется в key для обеспечения переключения языков
    const [thingName] = thingNames;
    const thingConfig = getThingConfig(thingName);
    const { sideNavSectionsForContent } = thingConfig;
    return {
      pathname: baseUrl,
      title: appName,
      component: (
        <Layout2
          sideNavSections={sideNavSectionsForContent}
          thingName={thingName}
        >
          <Home key={locale} />
        </Layout2>
      ),
    };
  },
};
