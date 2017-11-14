import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { styles } from './styles';

export const SceneLoader = ({ color, size }) => (
  <View style={styles.wrap}>
    <ActivityIndicator color={color} size={size} />
  </View>
);


SceneLoader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
};

SceneLoader.defaultProps = {
  color: 'gray',
  size: 'small',
};
