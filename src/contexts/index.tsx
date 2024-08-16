import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import UrqlContextProvider from './UrqlContext';

const ApplicationContext: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UrqlContextProvider>{children}</UrqlContextProvider>
    </GestureHandlerRootView>
  );
};
export default ApplicationContext;
