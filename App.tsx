import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from 'sentry-expo';
import { ApolloProvider } from '@apollo/client';

import AppNavigator from 'app/navigation/App';
import BootScreen from 'app/screens/Boot';
import client from 'app/utils/client';

enableScreens();

Sentry.init({
  dsn:
    'https://068b9ab849bf4485beb4884adcc5be83@o55600.ingest.sentry.io/200469',
  enableInExpoDevelopment: false,
  debug: true,
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <BootScreen>
            <AppNavigator />
          </BootScreen>
        </NavigationContainer>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
