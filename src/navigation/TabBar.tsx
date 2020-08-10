import React from 'react';
import {
  Platform,
  View,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
  BottomTabBarOptions,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Route } from '@react-navigation/native';

import {
  extraDarkPurple,
  tabBarPurple,
  tabbarSelectedTextColor,
  white,
} from 'app/constants/colors';
import {
  HomeIcon,
  NotificationsIcon,
  QuickUpdateIcon,
  SearchIcon,
} from 'app/assets/icons/tabs';

import Home from './Home';

export type TabBarNavigatorParamList = {
  Home: undefined;
  Search: undefined;
  QuickUpdate: undefined;
  Notifications: undefined;
  Library: undefined;
};

const Tab = createBottomTabNavigator<TabBarNavigatorParamList>();

type TouchableComponent = React.FC<
  TouchableNativeFeedbackProps | TouchableWithoutFeedbackProps
>;

const Touchable: TouchableComponent =
  Platform.OS === 'ios'
    ? (args) => <TouchableWithoutFeedback {...args} />
    : (args) => (
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          {...args}
        />
      );

function TabBarIcon({
  route,
  options,
  focused,
  onPress,
}: {
  route: Route<string>;
  options: BottomTabNavigationOptions;
  focused: boolean;
  onPress: (e: GestureResponderEvent) => void;
}) {
  return (
    <Touchable onPress={onPress} key={route.name}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        {options.tabBarIcon
          ? // @ts-ignore
            options.tabBarIcon({
              focused,
              color: focused ? tabbarSelectedTextColor : white,
            })
          : null}
      </View>
    </Touchable>
  );
}

function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps<BottomTabBarOptions>) {
  return (
    <View
      style={{
        height: 50,
        backgroundColor: tabBarPurple,
        borderColor: extraDarkPurple,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'stretch',
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;

        return (
          <TabBarIcon
            route={route}
            options={options}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
}

export default function TabBarNavigator() {
  return (
    <Tab.Navigator tabBar={TabBar}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <HomeIcon opacity={focused ? 1 : 0.5} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <SearchIcon opacity={focused ? 1 : 0.5} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="QuickUpdate"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <QuickUpdateIcon opacity={focused ? 1 : 0.5} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Home}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <NotificationsIcon opacity={focused ? 1 : 0.5} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Library" component={Home} />
    </Tab.Navigator>
  );
}
