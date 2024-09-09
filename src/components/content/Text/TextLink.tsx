import { openBrowserAsync } from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { OpenSans } from '@/constants/fonts';

export default function TextLink({ style, ...props }: TextProps) {
  return <Text style={[styles.link, style]} {...props} />;
}

export const TextWebLink = ({ url, ...props }: TextProps & { url: string }) => {
  return <TextLink onPress={() => openBrowserAsync(url)} {...props} />;
};

const styles = StyleSheet.create({
  link: {
    fontFamily: OpenSans.bold,
  },
});
