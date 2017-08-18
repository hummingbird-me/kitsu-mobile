import React from 'react';
import PropTypes from 'prop-types';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import config from 'kitsu/assets/fonts/icons/config.json';

const Icon = createIconSetFromFontello(config);

const icon = ({ name, size, color, styles }) => (
  <Icon name={name} size={size} color={color} style={styles} />
);

icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  styles: PropTypes.object,
};
icon.defaultProps = {
  size: 12,
  color: '#000000',
  styles: {},
};

export default icon;
