import React, { useContext, type MutableRefObject } from 'react';
import type RNGHDrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import InvariantViolated from '@/errors/InvariantViolated';

export const DrawerContext =
  React.createContext<React.MutableRefObject<RNGHDrawerLayout | null> | null>(
    null
  );

export function useDrawer(): MutableRefObject<RNGHDrawerLayout> {
  const drawer = useContext(DrawerContext);

  if (!drawer)
    throw new InvariantViolated(
      'useDrawer must be used within a DrawerContext.Provider'
    );

  // Typescript can't narrow the type of drawer.current to not be null
  return drawer as unknown as MutableRefObject<RNGHDrawerLayout>;
}
