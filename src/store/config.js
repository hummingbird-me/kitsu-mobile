import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

import * as reducers from './reducers';

const middlewares = [thunk, createActionBuffer(REHYDRATE)];
if (__DEV__) {
  middlewares.push(createLogger({}));
}

export default function configureStore() {
  const store = createStore(
    combineReducers({
      ...reducers,
    }),
    compose(applyMiddleware(...middlewares), autoRehydrate()),
  );

  persistStore(store, { storage: AsyncStorage });

  return store;
}
