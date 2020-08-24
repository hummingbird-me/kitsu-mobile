import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import * as colors from 'app/constants/colors';
import { OpenSans } from 'app/constants/fonts';

export default function SettingsListGroup({
  children,
  style,
}: {
  children?: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.titleWrapper, style]}>
      <Text style={styles.titleText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.listBackPurple,
  },
  titleText: {
    color: colors.white,
    fontFamily: OpenSans.normal,
    fontSize: 12,
  },
});
