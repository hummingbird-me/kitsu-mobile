import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgProps } from 'react-native-svg';

import {
  HomeIcon,
  NotificationsIcon,
  QuickUpdateIcon,
  SearchIcon,
  LibraryIcon,
} from 'app/assets/icons/tabs';

import TabBar from './components/TabBar';
import Home from './Home';
import MainNavigator, { MainNavigatorParamList } from './MainNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabBarNavigatorParamList = {
  Home: NavigatorScreenParams<MainNavigatorParamList>;
  Search: undefined;
  QuickUpdate: undefined;
  Notifications: undefined;
  Library: undefined;
};

const Tab = createBottomTabNavigator<TabBarNavigatorParamList>();

const tabBarIconFor = (Icon: React.FC<SvgProps>) => ({
  focused,
  color,
}: {
  focused: boolean;
  color: string;
}) => <Icon opacity={focused ? 1 : 0.5} color={color} />;

export default function TabBarNavigator() {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} safeAreaInsets={safeAreaInsets} />}>
      <Tab.Screen name="Home" options={{ tabBarIcon: tabBarIconFor(HomeIcon) }}>
        {() => <MainNavigator initialRouteName="Feed" />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{ tabBarIcon: tabBarIconFor(SearchIcon) }}>
        {() => <MainNavigator initialRouteName="Search" />}
      </Tab.Screen>
      <Tab.Screen
        name="QuickUpdate"
        options={{ tabBarIcon: tabBarIconFor(QuickUpdateIcon) }}>
        {() => <MainNavigator initialRouteName="QuickUpdate" />}
      </Tab.Screen>
      <Tab.Screen
        name="Notifications"
        options={{ tabBarIcon: tabBarIconFor(NotificationsIcon) }}>
        {() => <MainNavigator initialRouteName="Debug" />}
      </Tab.Screen>
      <Tab.Screen
        name="Library"
        options={{ tabBarIcon: tabBarIconFor(LibraryIcon) }}>
        {() => <MainNavigator initialRouteName="Library" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
