/* global __DEV__, window */
import { applyMiddleware, compose, createStore } from 'redux';
import {
  persistStore as persistStoreRaw,
  persistCombineReducers,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';
import * as reducers from './reducers';

const config = {
  key: 'primary',
  storage: AsyncStorage,
  blacklist: ['anime', 'feed'],
};

const middlewares = [thunk];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  persistCombineReducers(config, reducers),
  undefined,
  composeEnhancers(applyMiddleware(...middlewares))
);

// promisify persistStore
export const persistStore = new Promise((resolve) => {
  persistStoreRaw(store, undefined, () => {
    resolve();
  });
});

// export const persistor = persistStore(store);
export default store;
