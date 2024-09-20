import { type StackNavigationProp } from '@react-navigation/stack';
import React, {
  createContext,
  createRef,
  useContext,
  useMemo,
  type MutableRefObject,
} from 'react';

import { type StackNavigatorParamList } from '@/navigation/Root/Stack/StackNavigator';

// TODO: decide if this should be global or not
// Pros: we can use it for deep linking
// Cons: fuck globals
const navigationRef = createRef() as unknown as MutableRefObject<
  StackNavigationProp<StackNavigatorParamList>
>;
export const StackNavigationContext = createContext(navigationRef);

export function StackNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StackNavigationContext.Provider value={navigationRef}>
      {children}
    </StackNavigationContext.Provider>
  );
}

export function useStackNavigation() {
  const navigationRef = useContext(StackNavigationContext);
  return useMemo(() => {
    // Generate a proxy object to safely handle swapping ref.current for methods called in render
    return new Proxy(
      {},
      {
        get(target, prop) {
          // @ts-expect-error We are doing naughty things here lmao
          return (...args) => navigationRef.current[prop](...args);
        },
      }
    ) as unknown as StackNavigationProp<StackNavigatorParamList>;
  }, [navigationRef]);
}
