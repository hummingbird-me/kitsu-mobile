import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from 'app/navigation/App';
import BootScreen from 'app/screens/Boot';

enableScreens();


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BootScreen>
          <AppNavigator />
        </BootScreen>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
