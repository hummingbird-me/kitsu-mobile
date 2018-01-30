import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import * as colors from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

export const GIFSelectText = ({ onPress, disabled }) => (
  <TouchableOpacity
    style={{
      borderColor: colors.green,
      borderWidth: 1,
      borderRadius: 4,
      height: 40,
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
      <Icon name="plus" style={{ color: colors.green, fontSize: 14, marginRight: 4 }} />
      <Text style={{ color: colors.green, fontSize: 14 }}>
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
