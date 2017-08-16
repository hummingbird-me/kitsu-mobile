/* global __DEV__ */
import React from 'react';
import { View, StatusBar } from 'react-native';
import { Provider, connect } from 'react-redux';
import { identity } from 'lodash';

import codePush from 'react-native-code-push';
import PropTypes from 'prop-types';
import store from './store/config';
import Root from './Router';

// eslint-disable-next-line
console.disableYellowBox = true;

const RootContainer = ({ badge }) => (
  <View style={{ flex: 1 }}>
    <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
    <Root screenProps={{ badge }} />
  </View>
);

RootContainer.propTypes = {
  badge: PropTypes.number.isRequired,
};

const ConnectedRoot = connect(({ feed }) => ({
  badge: feed.notificationsUnseen,
}))(RootContainer);

const App = () => (
  <Provider store={store}>
    <ConnectedRoot />
  </Provider>
);

// Check for Codepush only in production mode (Saves compile time & network calls in development).
const wrapper = __DEV__ ? identity : codePush;

export default wrapper(App);
