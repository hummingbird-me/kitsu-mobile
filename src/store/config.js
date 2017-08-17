/* global __DEV__, window */
import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import createActionBuffer from 'redux-action-buffer';

import * as reducers from './reducers';

const middlewares = [thunk, createActionBuffer(REHYDRATE)];

// if (__DEV__) {
//   const { createLogger } = require('redux-logger');
//   middlewares.push(createLogger({}));
// }

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combineReducers(reducers),
  composeEnhancers(applyMiddleware(...middlewares), autoRehydrate()),
);

persistStore(store, { storage: AsyncStorage, blacklist: ['anime', 'feed'] });

export default store;
