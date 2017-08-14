import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { AsyncStorage, NativeModules } from 'react-native';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

import * as reducers from './reducers';

const middlewares = [thunk, createActionBuffer(REHYDRATE)];
if (__DEV__) {
  // NativeModules.DevSettings.setIsDebuggingRemotely(true);
  middlewares.push(createLogger({}));
}

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    combineReducers({
      ...reducers,
    }),
    composeEnhancers(applyMiddleware(...middlewares), autoRehydrate()),
  );

  persistStore(store, { storage: AsyncStorage, blacklist: ['anime', 'feed'] });

  return store;
}
