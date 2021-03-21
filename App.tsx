import 'react-native-gesture-handler';
import React, { useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, NavigationContainerRef, Route } from '@react-navigation/native';

import AppNavigator from 'app/navigation/App';
import BootScreen from 'app/screens/Boot';
import { SessionContextProvider } from 'app/contexts/SessionContext';
import ApolloProvider from 'app/contexts/ApolloContext';
import { init as logInit, debug } from 'app/utils/log';

enableScreens();
logInit();

export default function App() {
  const navigationRef = useRef<NavigationContainerRef>(null);
  const routeRef = useRef<Route<string>>();

  return (
    <SafeAreaProvider>
      <SessionContextProvider>
        <ApolloProvider>
          <NavigationContainer ref={navigationRef} onReady={() =>
            (routeRef.current = navigationRef?.current?.getCurrentRoute())
          } onStateChange={() => {
            const previousRoute = routeRef.current;
            const currentRoute = navigationRef?.current?.getCurrentRoute();

            debug(`Navigation: ${previousRoute?.name} (${JSON.stringify(previousRoute?.params)}) => ${currentRoute?.name} (${JSON.stringify(currentRoute?.params)})`);

            // Save the current route name for later comparison
            routeRef.current = currentRoute;
          }}>
            <BootScreen>
              <AppNavigator />
            </BootScreen>
          </NavigationContainer>
        </ApolloProvider>
      </SessionContextProvider>
    </SafeAreaProvider>
  );
}
