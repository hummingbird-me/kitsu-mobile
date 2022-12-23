import { startCase, toLower } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { styles } from './styles';

interface PillProps {
  onPress(...args: unknown[]): unknown;
  title: string;
  color?: string;
  selected?: boolean;
  loading?: boolean;
}

export const Pill = ({
  onPress,
  loading,
  color,
  selected,
  title,
  ...otherProps
}: PillProps) => (
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
            <Text style={[styles.text, { color, marginTop: 1 }]}>
              {startCase(toLower(title))}
            </Text>
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
};
Pill.defaultProps = {
  selected: false,
  color: 'black',
  loading: false,
};
