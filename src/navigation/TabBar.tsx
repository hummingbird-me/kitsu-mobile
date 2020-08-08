import React from 'react';
import {
  Platform,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
  BottomTabBarOptions,
} from '@react-navigation/bottom-tabs';

import { darkPurple } from 'app/constants/colors';

import Home from './Home';

const Tab = createBottomTabNavigator();

function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps<BottomTabBarOptions>) {
  return (
    <View
      style={{ height: 50, backgroundColor: darkPurple, flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        return <View></View>;
      })}
    </View>
  );
}

export default function TabBarNavigator() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: darkPurple,
        inactiveBackgroundColor: darkPurple,
      }}
      tabBar={TabBar}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Home} />
      <Tab.Screen name="QuickUpdate" component={Home} />
      <Tab.Screen name="Notifications" component={Home} />
      <Tab.Screen name="Library" component={Home} />
    </Tab.Navigator>
  );
}
