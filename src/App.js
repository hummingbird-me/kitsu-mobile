import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { Provider, connect } from 'react-redux';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import PropTypes from 'prop-types';
import configureStore from './store/config';
import Root from './Router';
import * as types from './store/types';

const store = configureStore();
class App extends Component {
  componentWillMount() {
    // TODO: Once notifications are verified working, enable this if the in-app alert is ugly
    // OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentDidMount() {
    console.disableYellowBox = true;
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    console.log('Device has been registered for push notifications!', notifData);
  }

  onIds(device) {
    console.log('Device info: ', device);
    const { userId } = device;
    store.dispatch({ type: types.ONESIGNAL_ID_RECEIVED, payload: userId });
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
    <Root screenProps={{ badge }} />
  </View>
);

RootContainer.propTypes = {
  badge: PropTypes.number.isRequired,
};

const ConnectedRoot = connect(({ feed }) => ({
  badge: feed.notificationsUnseen,
}))(RootContainer);

export default codePush(App);
