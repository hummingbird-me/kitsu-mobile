import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { type SvgProps } from 'react-native-svg';

import { kitsuPurple } from '@/constants/palette';

import TabBarIcon from './TabBarIcon';

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <SafeAreaView
      edges={['bottom', 'right', 'left']}
      style={{
        height: 54 + bottom,
        backgroundColor: kitsuPurple[5],
        borderColor: kitsuPurple[4],
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-around',
      }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;

        return (
          <TabBarIcon
            key={route.key}
            /* Eventually we should fix the typings on the BottomTabDescriptorMap */
            /* But for now, we'll just cast it through unknown */
            icon={options.tabBarIcon as unknown as React.FC<SvgProps>}
            focused={focused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </SafeAreaView>
  );
}
