import {
  NavigationContainerRef,
  NavigationContainer as ReactNavigationContainer,
  Route,
} from '@react-navigation/native';
import React, { useRef } from 'react';

export default function NavigationContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Used to log navigation events
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeRef = useRef<Route<string>>();

  return (
    <ReactNavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeRef.current = navigationRef?.current?.getCurrentRoute())
      }
      onStateChange={() => {
        const previousRoute = routeRef.current;
        const currentRoute = navigationRef?.current?.getCurrentRoute();

        console.log(
          `Navigation: ${previousRoute?.name} (${JSON.stringify(
            previousRoute?.params
          )}) => ${currentRoute?.name} (${JSON.stringify(
            currentRoute?.params
          )})`
        );

        routeRef.current = currentRoute;
      }}>
      {children}
    </ReactNavigationContainer>
  );
}
