import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import TabBar from './TabBar';
import ProfileSidebar from './components/ProfileSidebar';
import { extraDarkPurple } from 'app/constants/colors';

export default function ProfileDrawerNavigator() {
  const { width } = useWindowDimensions();

  return (
    <DrawerLayout
      drawerWidth={width * 0.8}
      drawerPosition="left"
      drawerType="back"
      drawerBackgroundColor={extraDarkPurple}
      renderNavigationView={(props) => <ProfileSidebar {...props} />}>
      <TabBar />
    </DrawerLayout>
  );
}
