import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const PostStatus = ({ showViewParent, likesCount, commentsCount, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <View style={styles.postStatusRow}>
      <StyledText color="grey" size="xxsmall">{likesCount + (likesCount === 1 ? ' like' : ' likes')}</StyledText>
      {showViewParent && <StyledText color="grey" size="xxsmall">View Parent Post</StyledText>}
      <StyledText color="grey" size="xxsmall">{commentsCount} comments</StyledText>
    </View>
  </TouchableOpacity>
);

PostStatus.propTypes = {
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  showViewParent: PropTypes.bool,
  onPress: PropTypes.func,
};

PostStatus.defaultProps = {
  showViewParent: false,
  likesCount: 0,
  commentsCount: 0,
  onPress: null,
};
