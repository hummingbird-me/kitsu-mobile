import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from '@/components/StyledText';
import AvatarImage from '@/components/content/AvatarImage';
import { useAccount } from '@/contexts/AccountContext';
import { useDrawer } from '@/contexts/DrawerContext';

import { styles } from './styles';

type TabBarProps = {
  children?: React.ReactNode;
};

export const TabBar = ({ children }: TabBarProps) => {
  const { profile } = useAccount();
  const drawer = useDrawer();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabAvatar}
        onPress={() => drawer?.current.openDrawer()}>
        <AvatarImage size={24} source={profile.avatarImage} />
      </TouchableOpacity>
      {children}
    </View>
  );
};

type TabBarLinkProps = {
  onPress?(...args: unknown[]): unknown;
  label?: string;
  isActive?: boolean;
};

export const TabBarLink = ({ onPress, label, isActive }: TabBarLinkProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabStyle, isActive && styles.tabStyle__active]}>
    <StyledText color={isActive ? 'light' : 'grey'} size="xsmall" bold>
      {label}
    </StyledText>
  </TouchableOpacity>
);
