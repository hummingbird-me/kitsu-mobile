import React from 'react';
import { Text, View } from 'react-native';

import { SolidButton } from '@/components/controls/Button';
import { useDrawer } from '@/contexts/DrawerContext';

export default function DebugScreen() {
  const drawer = useDrawer();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <SolidButton
        color="green"
        text="Open Drawer"
        onPress={() => drawer.current.openDrawer()}
      />
    </View>
  );
}
