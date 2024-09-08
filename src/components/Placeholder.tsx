import React from 'react';
import { Text, View } from 'react-native';

export default function Placeholder({
  text = 'placeholder',
}: {
  text: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>{text}</Text>
    </View>
  );
}
