import React from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#A0989F',
    fontWeight: 'bold',
  },
});

const NavButton = ({ children, ...props }) => (
  <TouchableHighlight style={styles.container} {...props}>
    <Text style={styles.text}>{children}</Text>
  </TouchableHighlight>
);

NavButton.propTypes = {
  children: PropTypes.string.isRequired,
};

export default NavButton;
