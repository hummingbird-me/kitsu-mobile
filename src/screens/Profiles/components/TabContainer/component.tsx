import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';

interface TabContainerProps {
  light?: boolean;
  padded?: boolean;
}

export const TabContainer = ({
  light,
  padded,
  ...props
}: TabContainerProps) => (
  <View style={styles.container}>
    <View
      style={[
        styles.tabContainer,
        light && styles.tabContainer__light,
        padded && styles.tabContainer__padded,
      ]}
      {...props}
    />
  </View>
);

TabContainer.defaultProps = {
  light: false,
  padded: false,
};
