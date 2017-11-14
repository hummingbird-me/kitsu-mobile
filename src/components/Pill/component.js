import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { PropTypes } from 'prop-types';
import { startCase, toLower } from 'lodash';
import { styles } from './styles';

export const Pill = ({ onPress, loading, color, selected, title, ...otherProps }) => (
  <TouchableOpacity
    activeOpacity={0.4}
    onPress={onPress}
    style={[
      styles.container,
      { borderColor: color },
      selected ? styles.containerSelected : { backgroundColor: color },
    ]}
    {...otherProps}
  >
    {loading ? (
      <View style={styles.contentWrapper}>
        <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
      </View>
    ) : (
      <View>
        {selected ? (
          <View style={styles.row}>
            <Icon style={[styles.icon, { color }]} name="md-checkmark" />
            <Text style={[styles.text, { color, marginTop: 1 }]}>{startCase(toLower(title))}</Text>
          </View>
        ) : (
          <Text style={styles.text}>{startCase(toLower(title))}</Text>
        )}
      </View>
    )}
  </TouchableOpacity>
);

Pill.propTypes = {
  ...TouchableOpacity.propTypes,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  selected: PropTypes.bool,
  loading: PropTypes.bool,
};
Pill.defaultProps = {
  selected: false,
  color: 'black',
  loading: false,
};
