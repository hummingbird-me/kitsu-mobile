import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, Text } from 'react-native';
import { darkGrey } from '../../constants/colors';

const styles = {
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 16,
    color: darkGrey,
  },
};

const NavButton = ({ children, ...props }) => (
  <TouchableHighlight style={styles.container} {...props}>
    <Text style={styles.text}>{children}</Text>
  </TouchableHighlight>
);

NavButton.propTypes = {
  children: PropTypes.string.isRequired,
};

export default NavButton;
