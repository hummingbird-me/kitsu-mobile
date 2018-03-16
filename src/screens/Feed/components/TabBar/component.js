import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { styles } from './styles';

export const TabBar = ({ currentUser, onPress, children }) => (
  <View style={styles.tabBar}>
    <TouchableOpacity style={styles.tabAvatar} onPress={onPress}>
      <Avatar size="small" avatar={(currentUser && currentUser.avatar && currentUser.avatar.medium) || defaultAvatar} />
    </TouchableOpacity>
    {children}
  </View>
);

export const TabBarLink = ({ onPress, label, isActive }) => (
  <TouchableOpacity onPress={onPress} style={[styles.tabStyle, isActive && styles.tabStyle__active]}>
    <StyledText color={isActive ? 'light' : 'grey'} size="xsmall" bold>
      {label}
    </StyledText>
  </TouchableOpacity>
);

TabBar.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node,
};

TabBar.defaultProps = {
  currentUser: null,
  onPress: null,
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
