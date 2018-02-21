/* global __DEV__ */
import React, { PureComponent } from 'react';
import { Platform, View, StatusBar, Linking } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { identity, isNull, isEmpty } from 'lodash';
import { Sentry } from 'react-native-sentry';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import PropTypes from 'prop-types';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import store from './store/config';
import Root from './Router';
import { NotificationModal } from './components/NotificationModal';
import * as types from './store/types';
import { markNotifications } from './store/feed/actions';
import { kitsuConfig } from 'kitsu/config/env';


// eslint-disable-next-line
console.disableYellowBox = true;

// If you're using the debugging tools for React Native, the network tab is normally useless
// because it shows network activity to load the JS bundle only. This line causes it to
// use the dev tools XMLHttpRequest object if dev tools is running, making the network
// tab useful again. If dev tools isn't running, this will have no effect.
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

class App extends PureComponent {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('registered', this.onPNRegistered);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    this.unsubscribe = store.subscribe(this.onStoreUpdate);
  }

  componentDidMount() {
    OneSignal.requestPermissions({ alert: true, sound: true, badge: true });
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    OneSignal.removeEventListener('registered', this.onPNRegistered);
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    this.unsubscribe();
  }

  onStoreUpdate = () => {
    // Check if authentication state changed
    const authenticated = store.getState().auth.isAuthenticated;

    this.updateSentryContext(authenticated);

    // If the authentication state changed from true to false then take user to intro screen
    if (!isNull(this.authenticated) && this.authenticated !== authenticated && !authenticated) {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Intro' })],
        key: null,
      });
      this.navigation.dispatch(resetAction);
    }

    // Set the new authentication value
    this.authenticated = authenticated;
  }

  onIds(device) {
    console.log(device.userId);
    store.dispatch({ type: types.ONESIGNAL_ID_RECEIVED, payload: device.userId });
  }

  onPNRegistered = (notificationData) => {
    console.log('device registered', notificationData);
  };

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.group('Opened Notification');
    console.log('Notification', openResult.notification);
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    console.groupEnd();

    /**
     * Looks like navigating from root router to a nested screen inside the tab
     * stack is not possible. Created a hacky TabNavigator with initial screen
     * of Notifications. This way user can navigate to related
     * notification.
     *
     * Related issues: react-community/react-navigation
     *  #1127, #1715,
     */
    const resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'TabsNotification' })],
    });
    this.navigation.dispatch(resetAction);
  }

  updateSentryContext = (authenticated) => {
    const user = store.getState().user.currentUser;
    if (isEmpty(user)) return;

    if (authenticated) {
      Sentry.setUserContext({
        id: user.id,
        email: user.email,
        username: user.name,
      });
      Sentry.setTagsContext({
        environment: kitsuConfig.isProduction ? 'production' : 'staging',
        react: true,
      });
    } else {
      Sentry.clearContext();
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

const RootContainer = ({ inAppNotification }) => (
  <View style={{ flex: 1 }}>
    <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
    <Root
      ref={(nav) => {
        this.navigation = nav;
      }}
    />
    <NotificationModal
      visible={inAppNotification.visible}
      data={inAppNotification.data}
      onRequestClose={() => store.dispatch({ type: types.DISMISS_IN_APP_NOTIFICATION })}
    />
  </View>
);

RootContainer.propTypes = {
  inAppNotification: PropTypes.object.isRequired,
};

const ConnectedRoot = connect(({ feed }) => ({
  inAppNotification: feed.inAppNotification,
}))(RootContainer);

// Check for Codepush only in production mode (Saves compile time & network calls in development).
// FIXME: Codepush is making android crash
const wrapper = __DEV__ || Platform.OS === 'android' ? identity : codePush;

export default wrapper(App);
