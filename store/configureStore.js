// import { createStore, applyMiddleware } from 'redux';
// *****************************************************************************
import { createStore, applyMiddleware, compose } from 'redux';
// *****************************************************************************
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// *****************************************************************************
// подгружаем дополнительные пакеты
import { createResponsiveStoreEnhancer } from 'redux-responsive';
// *****************************************************************************

import { name, version } from '../../package.json';
// import rootReducer from '../reducers';
// *****************************************************************************
import createRootReducer from '../reducers';
// *****************************************************************************
import createHelpers from './createHelpers';
// import createLogger from './logger';
// ****************************************************************************
// кастомное middleware
import mediaTypeCookieSetter from './middleware/mediaTypeCookieSetter';
import persistUser from './middleware/persistUser';
// ****************************************************************************

export default function configureStore(initialState, helpersConfig) {
  const helpers = createHelpers(helpersConfig);
  const middleware = [
    thunk.withExtraArgument(helpers),
    // ****************************************************************************
    // добавляем middleware
    mediaTypeCookieSetter,
    persistUser,
    // ****************************************************************************
  ];

  let enhancer;

  // *************************************************************************
  // строим responsiveStoreEnhancer
  const responsiveStoreEnhancer = createResponsiveStoreEnhancer({
    // calculateInitialState = false, чтобы при воссоздании стора на клиенте,
    // из данных полученных на сервере, данные автоматически НЕ подменялись,
    // а изменялись (при необходимости) уже при повторном пересчете на клиенте
    // после выполенения действия: calculateResponsiveState
    calculateInitialState: false,
  });
  // *************************************************************************

  if (__DEV__) {
    // middleware.push(createLogger());

    // https://github.com/zalmoxisus/redux-devtools-extension#14-using-in-production
    const composeEnhancers = composeWithDevTools({
      // Options: https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#options
      name: `${name}@${version}`,
    });

    // https://redux.js.org/docs/api/applyMiddleware.html
    // enhancer = composeEnhancers(applyMiddleware(...middleware));
    // *************************************************************************
    // заменяем кастомным энхансером
    enhancer = composeEnhancers(
      responsiveStoreEnhancer,
      applyMiddleware(...middleware),
    );
    // *************************************************************************
  } else {
    // enhancer = applyMiddleware(...middleware);
    // *************************************************************************
    // заменяем кастомным энхансером
    enhancer = compose(responsiveStoreEnhancer, applyMiddleware(...middleware));
    // *************************************************************************
  }

  // *************************************************************************
  // используем createRootReducer который содержит в качестве аргумента helpersConfig
  // чтобы передать значение initialMediaType
  const rootReducer = createRootReducer(helpersConfig);
  // *************************************************************************

  // https://redux.js.org/docs/api/createStore.html
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (__DEV__ && module.hot) {
    module.hot.accept('../reducers', () =>
      // Don't forget to remove `()` if you change reducers back to normal rootReducer.
      // eslint-disable-next-line global-require
      store.replaceReducer(require('../reducers').default()),
    );
  }

  return store;
}
