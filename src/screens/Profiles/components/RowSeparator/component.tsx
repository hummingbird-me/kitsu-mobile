import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

interface RowSeparatorProps {
  size?: "default" | "medium" | "large";
  transparent?: boolean;
}

export const RowSeparator = ({
  size,
  transparent
}: RowSeparatorProps) => (
  <View
    style={[
      styles.separator,
      styles[`separator__${size}`],
      transparent && styles.separator__transparent,
    ]}
  />
);

RowSeparator.defaultProps = {
  size: 'default',
  transparent: false,
};
