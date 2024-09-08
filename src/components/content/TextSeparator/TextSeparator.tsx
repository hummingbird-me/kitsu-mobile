import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OpenSans } from '@/constants/fonts';
import { kitsuPurple } from '@/constants/palette';

export default function TextSeparator({ text }: { text: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  text: {
    color: kitsuPurple[2],
    textTransform: 'uppercase',
    fontFamily: OpenSans.semibold,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: kitsuPurple[3],
  },
});
