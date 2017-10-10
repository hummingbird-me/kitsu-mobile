import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/parts';

const Container = glamorous.view(
  {
    width: 30,
    height: 30,
    borderRadius: 30,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F1F1F1',
  },
);

const Avatar = ({ avatar }) => (
  <Container>
    <StyledProgressiveImage
      resize="cover"
      source={{ uri: avatar || defaultAvatar }}
    />
  </Container>
);


Avatar.propTypes = {
  avatar: PropTypes.string,
};

Avatar.defaultProps = {
  avatar: '',
};

export default Avatar;
