import {
  NavigationContainer as ReactNavigationContainer,
  type NavigationContainerRef,
  type NavigationState,
  type ParamListBase,
} from '@react-navigation/native';
import React, { useRef } from 'react';

import { type RootNavigatorParamList } from '@/navigation/Root';

function formatBreadcrumbs<State extends NavigationState<ParamListBase>>(
  name: string,
  state: State | undefined,
  params?: unknown
): string {
  if (state) {
    const route = state.routes[state.index];
    return `${name}/${formatBreadcrumbs(
      route.name,
      route.state,
      route.params
    )}`;
  } else {
    return `${name}${params ? `(${JSON.stringify(params)})` : ''}`;
  }
}

export default function NavigationContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  // Used to log navigation events
  const navigationRef =
    useRef<NavigationContainerRef<RootNavigatorParamList>>(null);
  const routePath = useRef<string>();

  return (
    <ReactNavigationContainer
      ref={navigationRef}
      onReady={() => {
        routePath.current = formatBreadcrumbs(
          'Root',
          navigationRef?.current?.getRootState()
        );
      }}
      onStateChange={(state) => {
        const previousRoute = routePath.current;
        const currentRoute = formatBreadcrumbs('Root', state);

        console.log(`${previousRoute} -> ${currentRoute}`);

        routePath.current = currentRoute;
      }}>
      {children}
    </ReactNavigationContainer>
  );
}
