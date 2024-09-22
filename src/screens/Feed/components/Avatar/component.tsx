import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { defaultAvatar } from '@/constants/app';

import { styles } from './styles';

const avatarSizes = {
  large: 62,
  default: 42,
  medium: 36,
  small: 32,
  xsmall: 22,
};

type AvatarProps = {
  avatar: string;
  size?: 'large' | 'default' | 'medium' | 'small' | 'xsmall';
};

export const Avatar = ({ size = 'default', avatar }: AvatarProps) => (
  <View
    style={[
      styles.wrap,
      {
        width: avatarSizes[size],
        height: avatarSizes[size],
        borderRadius: avatarSizes[size],
      },
    ]}>
    <Image
      contentFit="cover"
      source={{ uri: avatar || defaultAvatar }}
      style={{ borderRadius: avatarSizes[size] }}
    />
  </View>
);