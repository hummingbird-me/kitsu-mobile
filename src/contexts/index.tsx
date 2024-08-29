import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import IntlContextProvider from './IntlContext';
import { SessionContextProvider } from './SessionContext';
import UrqlContextProvider from './UrqlContext';

const ApplicationContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <IntlContextProvider>
            <SessionContextProvider>
        <UrqlContextProvider>{children}</UrqlContextProvider>
            </SessionContextProvider>
        </IntlContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
export default ApplicationContext;
