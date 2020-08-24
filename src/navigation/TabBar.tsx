import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SvgProps } from 'react-native-svg';

import {
  HomeIcon,
  NotificationsIcon,
  QuickUpdateIcon,
  SearchIcon,
} from 'app/assets/icons/tabs';

import TabBar from './components/TabBar';
import Home from './Home';
import MainNavigator from './MainNavigator';

export type TabBarNavigatorParamList = {
  Home: undefined;
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
  return (
    <Tab.Navigator tabBar={TabBar}>
      <Tab.Screen name="Home" options={{ tabBarIcon: tabBarIconFor(HomeIcon) }}>
        {() => <MainNavigator initialRouteName="Feed" />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        component={Home}
        options={{ tabBarIcon: tabBarIconFor(SearchIcon) }}
      />
      <Tab.Screen
        name="QuickUpdate"
        component={Home}
        options={{ tabBarIcon: tabBarIconFor(QuickUpdateIcon) }}
      />
      <Tab.Screen
        name="Notifications"
        options={{ tabBarIcon: tabBarIconFor(NotificationsIcon) }}>
        {() => <MainNavigator initialRouteName="Debug" />}
      </Tab.Screen>
      <Tab.Screen name="Library">
        {() => <MainNavigator initialRouteName="Library" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
