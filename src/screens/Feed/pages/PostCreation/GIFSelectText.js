import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    borderColor: colors.green,
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.green,
    fontSize: 14,
    marginRight: 4,
  },
  text: {
    color: colors.green,
    fontSize: 14,
  },
});

export const GIFSelectText = ({ onPress, disabled }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.innerContainer} >
      <Icon name="plus" style={styles.icon} />
      <Text style={styles.text}>
        Add a GIF
      </Text>
    </View>
  </TouchableOpacity>
);

GIFSelectText.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

GIFSelectText.defaultProps = {
  disabled: false,
};
