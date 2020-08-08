import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TabBar from './TabBar';

const Drawer = createDrawerNavigator();

export default function ProfileDrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="TabBar" component={TabBar} />
    </Drawer.Navigator>
  );
}
