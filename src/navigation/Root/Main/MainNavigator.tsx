import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { type NavigatorScreenParams } from '@react-navigation/native';
import React, { useRef } from 'react';
import { View } from 'react-native';

import {
  HomeIcon,
  LibraryIcon,
  NotificationsIcon,
  QuickUpdateIcon,
  SearchIcon,
} from '@/assets/icons/tabs';
import DrawerLayout from '@/components/navigation/DrawerLayout';

import StackNavigator, {
  type StackNavigatorParamList,
} from '../Stack/StackNavigator';
import TabBar from './TabBar';

export type TabBarNavigatorParamList = {
  HomeTab: NavigatorScreenParams<StackNavigatorParamList>;
  SearchTab: NavigatorScreenParams<StackNavigatorParamList>;
  QuickUpdateTab: NavigatorScreenParams<StackNavigatorParamList>;
  NotificationsTab: NavigatorScreenParams<StackNavigatorParamList>;
  LibraryTab: NavigatorScreenParams<StackNavigatorParamList>;
};

const Tab = createBottomTabNavigator<TabBarNavigatorParamList>();

export default function TabBarNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      layout={({ children, state, descriptors, navigation }) => (
        <DrawerLayout
          state={state}
          descriptors={descriptors}
          navigation={navigation}>
          {children}
        </DrawerLayout>
      )}
      tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="HomeTab" options={{ tabBarIcon: HomeIcon }}>
        {() => <StackNavigator initialRouteName="Profile" />}
      </Tab.Screen>
      <Tab.Screen name="SearchTab" options={{ tabBarIcon: SearchIcon }}>
        {() => <StackNavigator initialRouteName="Search" />}
      </Tab.Screen>
      <Tab.Screen
        name="QuickUpdateTab"
        options={{ tabBarIcon: QuickUpdateIcon }}>
        {() => <StackNavigator initialRouteName="QuickUpdate" />}
      </Tab.Screen>
      <Tab.Screen
        name="NotificationsTab"
        options={{ tabBarIcon: NotificationsIcon }}>
        {() => <StackNavigator initialRouteName="Debug" />}
      </Tab.Screen>
      <Tab.Screen name="LibraryTab" options={{ tabBarIcon: LibraryIcon }}>
        {() => <StackNavigator initialRouteName="Library" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
