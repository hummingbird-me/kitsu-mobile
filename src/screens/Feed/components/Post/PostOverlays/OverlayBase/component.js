import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from './styles';

export const OverlayBase = ({ onPress, foregroundText, backgroundText }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.wrapper}>
      <Text style={styles.foregroundText}>{foregroundText}</Text>
      <Text style={styles.backgroundText}>{backgroundText}</Text>
    </View>
  </TouchableOpacity>
);

OverlayBase.propTypes = {
  onPress: PropTypes.func,
  foregroundText: PropTypes.string,
  backgroundText: PropTypes.string,
};

OverlayBase.defaultProps = {
  onPress: null,
  foregroundText: null,
  backgroundText: null,
};
