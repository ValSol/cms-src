import React from 'react';

import { appName } from '../../appConfig';
import { NoJs } from './NoJs';

export default {
  path: '/:slug?',

  action(context) {
    const { params: { slug } } = context;
    if (slug) return null;

    return {
      title: appName,
      component: <NoJs />,
    };
  },
};
