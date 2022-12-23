import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

interface OverlayBaseProps {
  onPress?(...args: unknown[]): unknown;
  foregroundText?: string;
  backgroundText?: string;
}

export const OverlayBase = ({
  onPress,
  foregroundText,
  backgroundText,
}: OverlayBaseProps) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.wrapper}>
      <Text style={styles.foregroundText}>{foregroundText}</Text>
      <Text style={styles.backgroundText}>{backgroundText}</Text>
    </View>
  </TouchableOpacity>
);

OverlayBase.defaultProps = {
  onPress: null,
  foregroundText: null,
  backgroundText: null,
};
