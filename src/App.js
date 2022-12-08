/* global __DEV__ */
import React, { PureComponent } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import { identity, isNil, isEmpty } from 'lodash';
import * as Sentry from '@sentry/react-native';
import { fetchAlgoliaKeys } from 'kitsu/store/app/actions';
import { kitsuConfig } from 'kitsu/config/env';
import { KitsuLibrary, KitsuLibraryEvents, KitsuLibraryEventSource } from 'kitsu/utils/kitsuLibrary';
import { NavigationActions } from 'kitsu/navigation';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { fetchNotifications } from 'kitsu/store/feed/actions';
import store, { persistStore } from './store/config';
import * as profile from './store/profile/actions';

class App extends PureComponent {
  componentWillMount() {
    // Register all global app events here
    store.subscribe(onStoreUpdate);
    KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_CREATE, onLibraryEntryCreated);
    KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, onLibraryEntryUpdated);
    KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, onLibraryEntryDeleted);
  }

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    // Make sure store has been persisted
    await persistStore;

    // Fetch keys
    store.dispatch(fetchAlgoliaKeys());

    // Navigate to initial page
    const { auth, onboarding, app } = store.getState();
    this.navigate(!!auth.isAuthenticated, !!onboarding.completed, app.initialPage);
  }

  navigate(authenticated, onBoardingCompleted, initialTab = 'Feed') {
    if (authenticated && onBoardingCompleted) {
      this.fetchCurrentUser();

      // Show the main screen of the app
      NavigationActions.showMainApp(initialTab);
    } else if (authenticated) {
      // Show onboarding
      NavigationActions.showOnboarding();
    } else {
      // Show intro screen
      NavigationActions.showIntro();
    }
  }

  fetchCurrentUser = async () => {
    try {
      await store.dispatch(fetchCurrentUser());
      store.dispatch(fetchNotifications());
    } catch (e) {
      console.warn(e);
    }
  };

  render() {
    // Just render a loading screen here
    // Once store is persisted, the initialize function will automatically set the root properley
    return (
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
  }
}

/*
 * Events for handling kitsu library and store
 */

let isAuthenticated = false;

function onStoreUpdate() {
  // Check if authentication state changed
  const authenticated = store.getState().auth.isAuthenticated;
  const user = store.getState().user.currentUser;

  // Update sentry
  if (authenticated) {
    if (!isEmpty(user)) {
      Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.name,
      });
    }
  } else {
    Sentry.configureScope((scope) => scope.clear());
  }

  Sentry.setTag(
    'environment',
    kitsuConfig.isProduction ? 'production' : 'staging'
  );
  Sentry.setTag('react', true);
  Sentry.setTag('version', kitsuConfig.version);

  // If the authentication state changed from `true` to `false` then take user to intro screen
  if (
    !isNil(isAuthenticated) &&
    !isNil(authenticated) &&
    isAuthenticated !== authenticated && !authenticated
  ) {
    // Take user back to intro
    NavigationActions.showIntro();
  }

  // Set the new authentication value
  isAuthenticated = authenticated;
}

function onLibraryEntryCreated(data) {
  const { currentUser } = store.getState().user;

  if (!data || !currentUser || !currentUser.id) return;

  // Check to see if we got this event from something other than 'store'
  const { status, type, entry, source } = data;
  if (!entry || source === KitsuLibraryEventSource.STORE) return;

  // Add  the store entry
  store.dispatch(profile.onLibraryEntryCreate(entry, currentUser.id, type, status));
}

function onLibraryEntryUpdated(data) {
  const { currentUser } = store.getState().user;

  if (!data || !currentUser || !currentUser.id) return;

  // Check to see if we got this event from something other than 'store'
  const { type, oldEntry, newEntry, source } = data;
  if (!oldEntry || !newEntry || source === KitsuLibraryEventSource.STORE) return;

  // Update the store entry
  store.dispatch(profile.onLibraryEntryUpdate(currentUser.id, type, oldEntry.status, newEntry));
}

function onLibraryEntryDeleted(data) {
  const { currentUser } = store.getState().user;

  if (!data || !currentUser || !currentUser.id) return;

  // Check to see if we got this event from something other than 'store'
  const { id, type, status, source } = data;
  if (!id || source === KitsuLibraryEventSource.STORE) return;

  // Delete the store entry
  store.dispatch(profile.onLibraryEntryDelete(id, currentUser.id, type, status));
}

// FIXME: Codepush is making android crash
const wrapper = __DEV__ || Platform.OS === 'android' ? identity : codePush;

export default wrapper(App);
