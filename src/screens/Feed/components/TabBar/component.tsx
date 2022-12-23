import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';
import { defaultAvatar } from 'kitsu/constants/app';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';

import { styles } from './styles';

interface TabBarProps {
  currentUser: object;
  onPress(...args: unknown[]): unknown;
  children?: React.ReactNode;
}

export const TabBar = ({ currentUser, onPress, children }: TabBarProps) => (
  <View style={styles.tabBar}>
    <TouchableOpacity style={styles.tabAvatar} onPress={onPress}>
      <Avatar
        size="small"
        avatar={
          (currentUser && currentUser.avatar && currentUser.avatar.medium) ||
          defaultAvatar
        }
      />
    </TouchableOpacity>
    {children}
  </View>
);

interface TabBarLinkProps {
  onPress?(...args: unknown[]): unknown;
  label?: string;
  isActive?: boolean;
}

export const TabBarLink = ({ onPress, label, isActive }: TabBarLinkProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabStyle, isActive && styles.tabStyle__active]}
  >
    <StyledText color={isActive ? 'light' : 'grey'} size="xsmall" bold>
      {label}
    </StyledText>
  </TouchableOpacity>
);

TabBar.defaultProps = {
  currentUser: null,
  onPress: null,
  children: null,
};

TabBarLink.defaultProps = {
  onPress: null,
  label: '',
  isActive: false,
};
