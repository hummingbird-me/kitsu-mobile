import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledProgressiveImage } from 'kitsu/screens/Feed/components/StyledProgressiveImage';
import { styles } from './styles';

const avatarSizes = {
  default: 42,
  small: 32,
  xsmall: 22,
};

export const Avatar = ({ size, avatar }) => (
  <View
    style={[
      styles.wrap,
      {
        width: avatarSizes[size],
        height: avatarSizes[size],
        borderRadius: avatarSizes[size],
      },
    ]}
  >
    <StyledProgressiveImage
      resize="cover"
      source={{ uri: avatar || defaultAvatar }}
    />
  </View>
);


Avatar.propTypes = {
  avatar: PropTypes.string,
  size: PropTypes.oneOf(['default', 'small', 'xsmall']),
};

Avatar.defaultProps = {
  avatar: null,
  size: 'default',
};
