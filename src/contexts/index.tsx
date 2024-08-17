import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import UrqlContextProvider from './UrqlContext';

const ApplicationContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <UrqlContextProvider>{children}</UrqlContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
export default ApplicationContext;
