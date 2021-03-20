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

export default function TabBar({
  state,
  descriptors,
  navigation,
  safeAreaInsets,
}: BottomTabBarProps<BottomTabBarOptions>) {
  return (
    <View
      style={{
        height: 50 + (safeAreaInsets?.bottom ?? 0),
        backgroundColor: tabBarPurple,
        borderColor: extraDarkPurple,
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'stretch',
        paddingBottom: safeAreaInsets?.bottom,
        paddingRight: safeAreaInsets?.right,
        paddingLeft: safeAreaInsets?.left,
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;

        return (
          <TabBarIcon
            key={route.key}
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
