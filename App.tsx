import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from 'app/navigation/App';
import BootScreen from 'app/screens/Boot';
import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloProvider from 'app/contexts/ApolloContext';
import { init as logInit } from 'app/utils/log';

enableScreens();
logInit();

export default function App() {
  return (
    <SafeAreaProvider>
      <SessionContextProvider>
        <ApolloProvider>
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
