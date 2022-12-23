import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles';

interface SceneLoaderProps {
  color?: string;
  size?: "small" | "large";
}

export const SceneLoader = ({
  color,
  size
}: SceneLoaderProps) => (
  <View style={styles.wrap}>
    <ActivityIndicator color={color} size={size} />
  </View>
);


SceneLoader.defaultProps = {
  color: 'gray',
  size: 'small',
};
