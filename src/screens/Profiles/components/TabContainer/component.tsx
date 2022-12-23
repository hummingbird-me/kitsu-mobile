import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { styles } from './styles';

export const TabContainer = ({ light, padded, ...props }) => (
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

TabContainer.propTypes = {
  light: PropTypes.bool,
  padded: PropTypes.bool,
};

TabContainer.defaultProps = {
  light: false,
  padded: false,
};
