import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropTypes } from 'prop-types';
import _ from 'lodash';
import { styles } from './styles';

export const Pill = ({ onPress, color, selected, title, ...otherProps }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.container,
      { borderColor: color },
      selected ? styles.containerSelected : { backgroundColor: color },
    ]}
    {...otherProps}
  >
    {selected ? (
      <View style={styles.row}>
        <Icon style={[styles.icon, { color }]} name="md-checkmark" />
        <Text style={[styles.text, { color, marginTop: 1 }]}>{_.startCase(_.toLower(title))}</Text>
      </View>
    ) : (
      <Text style={styles.text}>{_.startCase(_.toLower(title))}</Text>
    )}
  </TouchableOpacity>
);

Pill.propTypes = {
  ...TouchableOpacity.propTypes,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  selected: PropTypes.bool,
};
Pill.defaultProps = {
  selected: false,
  color: 'black',
};
