/* global __DEV__, window */
import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore as persistStoreRaw, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const config = {
  key: 'primary',
  storage,
  blacklist: ['anime', 'feed'],
};

// if (__DEV__) {
//   const { createLogger } = require('redux-logger');
//   middlewares.push(createLogger({}));
// }

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistCombineReducers(config, reducers),
  undefined,
  composeEnhancers(applyMiddleware(thunk)),
);

// promisify persistStore
export const persistStore = new Promise((resolve) => {
  persistStoreRaw(store, undefined, () => {
    resolve();
  });
});

// export const persistor = persistStore(store);
export default store;
