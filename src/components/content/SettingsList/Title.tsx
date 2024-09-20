import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { OpenSans } from '@/constants/fonts';
import { grey, white } from '@/constants/palette';

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
    borderBottomColor: grey[3],
    height: 44,
    backgroundColor: white,
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
    color: grey[7],
  },
});
