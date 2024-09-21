import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import IntlContextProvider from './IntlContext';
import NavigationContainer from './NavigationContainer';
import { SessionContextProvider } from './SessionContext';
import { StackNavigationProvider } from './StackNavigationContext';
import UrqlContextProvider from './UrqlContext';

const ApplicationContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <NavigationContainer>
      <StackNavigationProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <SafeAreaProvider>
              <IntlContextProvider>
                <SessionContextProvider>
                  <UrqlContextProvider>{children}</UrqlContextProvider>
                </SessionContextProvider>
              </IntlContextProvider>
            </SafeAreaProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </StackNavigationProvider>
    </NavigationContainer>
  );
};
export default ApplicationContext;
