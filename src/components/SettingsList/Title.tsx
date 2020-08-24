import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import * as colors from 'app/constants/colors';
import { OpenSans } from 'app/constants/fonts';

export default function SettingsListTitle({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.item, style]}>
      <View style={styles.leftContentWrapper}>
        <Text style={styles.text}>{title}</Text>
      </View>
      <View>
        <Text style={styles.text}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightGrey,
    height: 44,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: OpenSans.normal,
    fontSize: 12,
    marginLeft: 6,
    color: colors.softBlack,
  },
});
