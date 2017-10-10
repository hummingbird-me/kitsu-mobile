import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const TabBar = props => <View style={styles.tabBar}>{props.children}</View>;

export const TabBarLink = ({ onPress, label, isActive }) => (
  <TouchableOpacity onPress={onPress} style={styles.tabStyle}>
    <StyledText color={isActive ? 'orange' : 'grey'} size="xsmall" bold>{label}</StyledText>
  </TouchableOpacity>
);

TabBar.propTypes = {
  children: PropTypes.node,
};

TabBar.defaultProps = {
  children: null,
};

TabBarLink.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string,
  isActive: PropTypes.bool,
};

TabBarLink.defaultProps = {
  onPress: null,
  label: '',
  isActive: false,
};
