import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from 'sentry-expo';
import { ApolloProvider } from '@apollo/client';

import AppNavigator from 'app/navigation/App';
import BootScreen from 'app/screens/Boot';
import client from 'app/utils/client';
import { SessionContextProvider } from 'app/contexts/SessionContext';
import { init as logInit } from 'app/utils/log';

enableScreens();
logInit();

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionContextProvider>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <BootScreen>
              <AppNavigator />
            </BootScreen>
          </NavigationContainer>
        </ApolloProvider>
      </SessionContextProvider>
    </SafeAreaProvider>
  );
}
