import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';

const SidebarButton = ({ disabled = false, loading = false, onPress, title, style }) => (
  <View style={[styles.wrapper, style]}>
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.button, disabled ? styles.buttonDisabled : null, style]}
    >
      {loading
        ? <ActivityIndicator color="rgba(255,255,255,0.4)" />
        : <Text style={styles.title}>
          {title}
        </Text>}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  title: {
    color: colors.white,
    fontFamily: 'OpenSans-Semibold',
    lineHeight: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: colors.green,
    height: 47,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.buttonDisabledColor,
  },
});

SidebarButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  loading: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

SidebarButton.defaultProps = {
  style: null,
  loading: false,
  disabled: false,
  onPress: () => {},
  title: 'Save',
};

export default SidebarButton;
