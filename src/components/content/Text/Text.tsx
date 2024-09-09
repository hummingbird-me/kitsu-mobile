import React from 'react';
import { Text as RNText, StyleSheet, type TextProps } from 'react-native';

import { OpenSans } from '@/constants/fonts';

export default function Text({ style, ...props }: TextProps) {
  return <RNText style={[styles.body, style]} {...props} />;
}

const styles = StyleSheet.create({
  body: {
    fontFamily: OpenSans.normal,
    fontSize: 14,
    lineHeight: 20,
  },
});
