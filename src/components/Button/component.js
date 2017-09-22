import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';
import { styles } from './styles';

const LoadingComponent = () => (
  <View style={styles.contentWrapper}>
    <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
  </View>
);

export const Button = ({
  style,
  title,
  titleStyle,
  icon,
  iconStyle,
  onPress,
  loading,
  disabled,
}) => (
  <TouchableOpacity
    disabled={disabled || loading}
    onPress={onPress}
    style={[styles.button, disabled ? styles.buttonDisabled : null, style]}
  >
    {loading ? <LoadingComponent />
      : <View style={styles.contentWrapper}>
        {icon ? <Icon name={icon} style={[styles.icon, iconStyle]} /> : null}
        <Text style={[styles.title, titleStyle]}>
          {title}
        </Text>
      </View>
    }
  </TouchableOpacity>
);

Button.propTypes = {
  ...TouchableOpacity.propTypes,
  style: ViewPropTypes.style,
  title: PropTypes.string.isRequired,
  titleStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  icon: PropTypes.string,
  iconStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onPress: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};
Button.defaultProps = {
  style: null,
  title: 'Save',
  titleStyle: null,
  icon: null,
  iconStyle: null,
  loading: false,
  disabled: false,
};
