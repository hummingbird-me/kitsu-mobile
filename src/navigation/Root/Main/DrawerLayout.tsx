import { type StackNavigationProp } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import RNGHDrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import { kitsuPurple } from '@/constants/palette';
import { DrawerContext } from '@/contexts/DrawerContext';

import Drawer from './Drawer';

export default function DrawerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width } = useWindowDimensions();
  const drawerRef = useRef<RNGHDrawerLayout | null>(null);

  // The wrapper view ensures we don't get white flickers as the drawer opens
  return (
    <View style={{ flex: 1, backgroundColor: kitsuPurple[5] }}>
      <DrawerContext.Provider value={drawerRef}>
        <RNGHDrawerLayout
          ref={(value) => (drawerRef.current = value)}
          drawerWidth={width * 0.8}
          drawerPosition="left"
          drawerType="back"
          drawerBackgroundColor={kitsuPurple[5]}
          overlayColor="rgba(0, 0, 0, 0.4)"
          renderNavigationView={(props) => (
            <DrawerContext.Provider value={drawerRef}>
              <Drawer />
            </DrawerContext.Provider>
          )}>
          {children}
        </RNGHDrawerLayout>
      </DrawerContext.Provider>
    </View>
  );
}
