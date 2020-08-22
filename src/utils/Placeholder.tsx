import React from 'react';
import { View, Text } from 'react-native';

export function PlaceholderView({ text = 'placeholder' }: { text: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>{text}</Text>
    </View>
  );
}

export function placeholderScreen(text: string) {
  return () => <PlaceholderView text={text} />;
}
