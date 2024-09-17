import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as colors from '@/constants/colors';
import { useNavigation } from '@/navigation/Root/Landing/hooks';

export default function TabBar({
  current,
  email,
}: {
  current: 'sign-in' | 'sign-up' | 'reset-password';
  email: string;
}) {
  const { navigate } = useNavigation();

  return (
    <View style={styles.tabsWrapper}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.tab}
        onPress={() => navigate('Auth', { tab: 'sign-up', email })}>
        <Text
          style={[
            styles.tabTitle,
            current === 'sign-up' ? { color: colors.tabRed } : {},
          ]}>
          Sign up
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.tab}
        onPress={() => navigate('Auth', { tab: 'sign-in', email })}>
        <Text
          style={[
            styles.tabTitle,
            current === 'sign-in' ? { color: colors.tabRed } : {},
          ]}>
          Sign in
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.offBlack,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitle: {
    textAlign: 'center',
    color: colors.transparentWhite,
    fontWeight: 'bold',
  },
});
