/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { intlShape } from 'react-intl';

import messages from './notFoundMessages';

const NotFound = (props, context) => {
  const { formatMessage } = context.intl;
  return (
    <div>
      <h2>{formatMessage(messages.PageNotExist)}</h2>
      <hr />
      <p>{formatMessage(messages.TryToUseNavigationOrSearch)}</p>
    </div>
  );
};

NotFound.contextTypes = {
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
};

export default NotFound;
