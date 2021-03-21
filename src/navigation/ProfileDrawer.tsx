import React, { useRef } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import TabBar from './TabBar';
import ProfileSidebar from './components/ProfileSidebar';
import { extraDarkPurple } from 'app/constants/colors';
import * as colors from 'app/constants/colors';

export default function ProfileDrawerLayout() {
  const { width } = useWindowDimensions();
  const ref = useRef<DrawerLayout | null>();

  return (
    <DrawerLayout
      ref={(value) => (ref.current = value)}
      drawerWidth={width * 0.8}
      drawerPosition="left"
      contentContainerStyle={{
        shadowColor: colors.offBlack,
        shadowOpacity: 0.8,
        shadowRadius: 10,
      }}
      drawerType="back"
      drawerBackgroundColor={extraDarkPurple}
      renderNavigationView={(props) => (
        <ProfileSidebar
          {...props}
          closeDrawer={() => ref?.current?.closeDrawer()}
        />
      )}>
      <TabBar />
    </DrawerLayout>
  );
}
