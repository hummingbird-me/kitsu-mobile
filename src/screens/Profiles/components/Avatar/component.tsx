import React from 'react';
import { View } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { styles } from './styles';

interface AvatarProps {
  avatar?: string;
}

export const Avatar = ({
  avatar
}: AvatarProps) => (
  <View style={styles.wrap}>
    <StyledProgressiveImage
      resize="cover"
      source={{ uri: avatar || defaultAvatar }}
    />
  </View>
);


Avatar.defaultProps = {
  avatar: null,
};
