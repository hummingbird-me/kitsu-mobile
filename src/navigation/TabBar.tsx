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
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarIcon: tabBarIconFor(HomeIcon) }}
      />
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
        component={Home}
        options={{ tabBarIcon: tabBarIconFor(NotificationsIcon) }}
      />
      <Tab.Screen name="Library" component={Home} />
    </Tab.Navigator>
  );
}
