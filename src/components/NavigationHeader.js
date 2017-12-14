import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as PropTypes from 'prop-types';
import * as colors from 'kitsu/constants/colors';
import { SimpleHeader } from './SimpleHeader';

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: colors.white,
    paddingHorizontal: 4,
  },
});

export const NavigationHeader = ({ navigation, title, leftIcon, rightIcon, ...props }) => (
  <SimpleHeader
    titleContent={title}
    leftContent={leftIcon ? <Icon name={leftIcon} style={[styles.icon, { fontSize: 16 }]} /> : null}
    leftAction={() => navigation.goBack()}
    rightContent={rightIcon ? <Icon name={rightIcon} style={styles.icon} /> : null}
    {...props}
  />
);

NavigationHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  title: PropTypes.string,
};

NavigationHeader.defaultProps = {
  title: '',
  leftIcon: 'chevron-left',
  rightIcon: null,
};
