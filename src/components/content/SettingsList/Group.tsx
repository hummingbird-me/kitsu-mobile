import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { OpenSans } from '@/constants/fonts';
import { kitsuPurple, white } from '@/constants/palette';

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
    backgroundColor: kitsuPurple[4],
  },
  titleText: {
    color: white,
    fontFamily: OpenSans.normal,
    fontSize: 12,
  },
});
