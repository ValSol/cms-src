/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import createBrowserHistory from 'history/createBrowserHistory';

// Navigation manager, e.g. history.push('/home')
// https://github.com/mjackson/history
// export default process.env.BROWSER && createBrowserHistory();
// *************************************************************
// использовалось: process.env.BROWSER
// но поменял на проверку global.window
// чтобы тесты history отрабатывались нормально
export default global.window && createBrowserHistory();
// *************************************************************
