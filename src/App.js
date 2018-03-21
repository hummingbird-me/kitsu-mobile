/* global __DEV__ */
import React, { PureComponent } from 'react';
import { Platform, View, StatusBar, Linking, StyleSheet } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as colors from 'kitsu/constants/colors';
import { identity, isNil, isEmpty } from 'lodash';
import { Sentry } from 'react-native-sentry';
import codePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import PropTypes from 'prop-types';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { kitsuConfig } from 'kitsu/config/env';
import { NotificationPopover } from 'kitsu/components/NotificationPopover';
import { KitsuLibrary, KitsuLibraryEvents, KitsuLibraryEventSource } from 'kitsu/utils/kitsuLibrary';
import { ActivityIndicator } from 'react-native';
import store, { persistor } from './store/config';
import Root from './Router';
import * as types from './store/types';
import { markNotifications } from './store/feed/actions';
import * as profile from './store/profile/actions';

// eslint-disable-next-line
console.disableYellowBox = true;

// If you're using the debugging tools for React Native, the network tab is normally useless
// because it shows network activity to load the JS bundle only. This line causes it to
// use the dev tools XMLHttpRequest object if dev tools is running, making the network
// tab useful again. If dev tools isn't running, this will have no effect.
GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;

// A reset action for navigation
let resetAction = null;

class App extends PureComponent {
  componentWillMount() {
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.addEventListener('registered', this.onPNRegistered);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    this.unsubscribe = store.subscribe(this.onStoreUpdate);
    this.unsubscribeCreate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_CREATE, this.onLibraryEntryCreated);
    this.unsubscribeUpdate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, this.onLibraryEntryUpdated);
    this.unsubscribeDelete = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, this.onLibraryEntryDeleted);
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
    this.unsubscribeCreate();
    this.unsubscribeUpdate();
    this.unsubscribeDelete();
  }

  onStoreUpdate() {
    // Check if authentication state changed
    const authenticated = store.getState().auth.isAuthenticated;
    // If the authentication state changed from true to false then take user to intro screen
    if (
      !isNil(this.authenticated) &&
      !isNil(authenticated) &&
      this.authenticated !== authenticated && !authenticated
    ) {
      // Take user back to intro
      resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Intro' })],
        key: null,
      });
    }

    // Update sentry
    const user = store.getState().user.currentUser;
    if (authenticated) {
      if (!isEmpty(user)) {
        Sentry.setUserContext({
          id: user.id,
          email: user.email,
          username: user.name,
        });
        Sentry.setTagsContext({
          environment: kitsuConfig.isProduction ? 'production' : 'staging',
          react: true,
        });
      }
    } else {
      Sentry.clearContext();
    }

    // Set the new authentication value
    this.authenticated = authenticated;

    // Check if we have a reset action that we need to perform
    if (this.navigation && resetAction) {
      // @Note: `navigation` may not exist as a reference yet due to `PersistGate`
      // blocking children from rendering until state has been rehydrated.
      this.navigation.dispatch(resetAction);
      resetAction = null;
    }
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

  onOpened = (openResult) => {
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
    resetAction = NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'TabsNotification' })],
    });

    if (this.navigation && resetAction) {
      // @Note: `navigation` may not exist as a reference yet due to `PersistGate`
      // blocking children from rendering until state has been rehydrated.
      this.navigation.dispatch(resetAction);
      resetAction = null;
    }
  }

  onLibraryEntryCreated = (data) => {
    const { currentUser } = store.getState().user;

    if (!data || !currentUser || !currentUser.id) return;

    // Check to see if we got this event from something other than 'store'
    const { status, type, entry, source } = data;
    if (!entry || source === KitsuLibraryEventSource.STORE) return;

    // Add  the store entry
    store.dispatch(profile.onLibraryEntryCreate(entry, currentUser.id, type, status));
  }

  onLibraryEntryUpdated = (data) => {
    const { currentUser } = store.getState().user;

    if (!data || !currentUser || !currentUser.id) return;

    // Check to see if we got this event from something other than 'store'
    const { type, oldEntry, newEntry, source } = data;
    if (!oldEntry || !newEntry || source === KitsuLibraryEventSource.STORE) return;

    // Update the store entry
    store.dispatch(profile.onLibraryEntryUpdate(currentUser.id, type, oldEntry.status, newEntry));
  }

  onLibraryEntryDeleted = (data) => {
    const { currentUser } = store.getState().user;

    if (!data || !currentUser || !currentUser.id) return;

    // Check to see if we got this event from something other than 'store'
    const { id, type, status, source } = data;
    if (!id || source === KitsuLibraryEventSource.STORE) return;

    // Delete the store entry
    store.dispatch(profile.onLibraryEntryDelete(id, currentUser.id, type, status));
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <ConnectedRoot />
        </PersistGate>
      </Provider>
    );
  }
}

const Loading = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: colors.darkPurple,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <ActivityIndicator color="white" size="large" />
  </View>
);

const RootContainer = ({ inAppNotification }) => (
  <View style={{ flex: 1 }}>
    <StatusBar translucent backgroundColor={'rgba(0, 0, 0, 0.3)'} barStyle={'light-content'} />
    <Root
      ref={(nav) => {
        this.navigation = nav;
      }}
    />
    {inAppNotification && inAppNotification.visible &&
      <NotificationPopover
        style={styles.notification}
        data={inAppNotification.data}
        onRequestClose={() => store.dispatch({ type: types.DISMISS_IN_APP_NOTIFICATION })}
      />
    }
  </View>
);

RootContainer.propTypes = {
  inAppNotification: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 666,
  },
});

const ConnectedRoot = connect(({ feed }) => ({
  inAppNotification: feed.inAppNotification,
}))(RootContainer);

// Check for Codepush only in production mode (Saves compile time & network calls in development).
// FIXME: Codepush is making android crash
const wrapper = __DEV__ || Platform.OS === 'android' ? identity : codePush;

export default wrapper(App);
