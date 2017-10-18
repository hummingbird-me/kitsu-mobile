import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { styles } from './styles';

export const Avatar = ({ avatar }) => (
  <View style={styles.wrap}>
    <StyledProgressiveImage
      resize="cover"
      source={{ uri: avatar || defaultAvatar }}
    />
  </View>
);


Avatar.propTypes = {
  avatar: PropTypes.string,
};

Avatar.defaultProps = {
  avatar: null,
};
