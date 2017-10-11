import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { styles } from './styles';

export const CommentTextInput = ({
  avatar,
  showAvatar,
}) => (
  <View />
);


CommentTextInput.propTypes = {
  avatar: PropTypes.string,
  showAvatar: PropTypes.bool,
};

CommentTextInput.defaultProps = {
  avatar: null,
  showAvatar: false,
};
