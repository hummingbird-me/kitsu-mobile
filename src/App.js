/* global __DEV__ */
import React, { Component } from 'react';
import { View, StatusBar, Linking } from 'react-native';
import { Provider, connect } from 'react-redux';
import { identity } from 'lodash';

import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import PropTypes from 'prop-types';
import { NavigationActions } from 'react-navigation';
import store from './store/config';
import Root from './Router';
import * as types from './store/types';
import { markNotifications } from './store/feed/actions';

// eslint-disable-next-line
console.disableYellowBox = true;

class App extends Component {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    Linking.addEventListener('url', this.onUrl);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    Linking.removeEventListener('url', this.onUrl);
  }

  onIds(device) {
    store.dispatch({ type: types.ONESIGNAL_ID_RECEIVED, payload: device.userId });
  }

  onUrl({ url }) {
    const [path, query] = url.replace('https://kitsu.io/', '').split('?');
    const paths = path.split('/');
    const params = query.split('&').map(param => param.split('=')).reduce((acc, curr) => ({
      ...acc, [curr[0]]: curr[1],
    }), {});

    if (params.notification) {
      const { id } = store.getState().user.currentUser;
      const token = store.getState().auth.tokens.access_token;
      if (id) {
        markNotifications(id, token, [params.notification]);
      }
    }

    let action;
    switch (paths[0]) {
      // TODO: Add more handlers here as we get more pages implemented
      case 'users':
        if (paths[1]) {
          action = NavigationActions.navigate('UserProfile', { userSlug: paths[1] });
        }
        break;
      default:
    }

    if (action) {
      this.navigation.dispatch(action);
    } else {
      Linking.openURL(url);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRoot />
      </Provider>
    );
  }
}

const RootContainer = ({ badge }) => (
  <View style={{ flex: 1 }}>
    <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
    <Root ref={(nav) => { this.navigation = nav; }} screenProps={{ badge }} />
  </View>
);

RootContainer.propTypes = {
  badge: PropTypes.number.isRequired,
};

const ConnectedRoot = connect(({ feed }) => ({
  badge: feed.notificationsUnseen,
}))(RootContainer);

// Check for Codepush only in production mode (Saves compile time & network calls in development).
const wrapper = __DEV__ ? identity : codePush;

export default wrapper(App);
