/* global __DEV__, window */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyMiddleware, compose, createStore } from 'redux';
import {
  persistCombineReducers,
  persistStore as persistStoreRaw,
} from 'redux-persist';
import thunk from 'redux-thunk';

import * as reducers from './reducers';

const config = {
  key: 'primary',
  storage: AsyncStorage,
  blacklist: ['anime', 'feed'],
};

const middlewares = [thunk];

if (__DEV__) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const store = createStore(
  persistCombineReducers(config, reducers),
  undefined,
  compose(applyMiddleware(...middlewares))
);

// promisify persistStore
export const persistStore = new Promise((resolve) => {
  persistStoreRaw(store, undefined, () => {
    resolve();
  });
});

// export const persistor = persistStore(store);
export default store;
