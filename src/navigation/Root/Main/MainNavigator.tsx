import {
  createBottomTabNavigator,
  type BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { type NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';

import {
  HomeIcon,
  LibraryIcon,
  NotificationsIcon,
  QuickUpdateIcon,
  SearchIcon,
} from '@/assets/icons/tabs';

import {
  createStackNavigator,
  type StackNavigatorParamList,
} from '../Stack/StackNavigator';
import DrawerLayout from './DrawerLayout';
import TabBar from './TabBar';

export type MainNavigatorParamList = {
  HomeTab: NavigatorScreenParams<StackNavigatorParamList>;
  SearchTab: NavigatorScreenParams<StackNavigatorParamList>;
  QuickUpdateTab: NavigatorScreenParams<StackNavigatorParamList>;
  NotificationsTab: NavigatorScreenParams<StackNavigatorParamList>;
  LibraryTab: NavigatorScreenParams<StackNavigatorParamList>;
};
export type MainNavigatorScreenProps<
  Route extends keyof MainNavigatorParamList
> = BottomTabScreenProps<MainNavigatorParamList, Route>;

const Tab = createBottomTabNavigator<MainNavigatorParamList>();

/**
 * The main "top level" navigator for the application. Combines a tab bar with a drawer layout.
 */
export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      layout={({ children, state, descriptors, ...props }) => {
        return <DrawerLayout>{children}</DrawerLayout>;
      }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tab.Screen name="HomeTab" options={{ tabBarIcon: HomeIcon }}>
        {createStackNavigator({ initialRouteName: 'Feed' })}
      </Tab.Screen>
      <Tab.Screen name="SearchTab" options={{ tabBarIcon: SearchIcon }}>
        {createStackNavigator({ initialRouteName: 'Search' })}
      </Tab.Screen>
      <Tab.Screen
        name="QuickUpdateTab"
        options={{ tabBarIcon: QuickUpdateIcon }}>
        {createStackNavigator({ initialRouteName: 'QuickUpdate' })}
      </Tab.Screen>
      <Tab.Screen
        name="NotificationsTab"
        options={{ tabBarIcon: NotificationsIcon }}>
        {createStackNavigator({ initialRouteName: 'Debug' })}
      </Tab.Screen>
      <Tab.Screen name="LibraryTab" options={{ tabBarIcon: LibraryIcon }}>
        {createStackNavigator({ initialRouteName: 'Library' })}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
