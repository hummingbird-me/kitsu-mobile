import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { styles } from './styles';

export const RowSeparator = ({ size, transparent }) => (
  <View
    style={[
      styles.separator,
      styles[`separator__${size}`],
      transparent && styles.separator__transparent,
    ]}
  />
);

RowSeparator.propTypes = {
  size: PropTypes.oneOf(['default', 'medium', 'large']),
  transparent: PropTypes.bool,
};
RowSeparator.defaultProps = {
  size: 'default',
  transparent: false,
};
