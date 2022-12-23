import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

interface PostStatusProps {
  likesCount?: number;
  commentsCount?: number;
  showViewParent?: boolean;
  onPress?(...args: unknown[]): unknown;
}

export const PostStatus = ({
  showViewParent,
  likesCount,
  commentsCount,
  onPress
}: PostStatusProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <View style={styles.postStatusRow}>
      <StyledText color="grey" size="xxsmall">{likesCount + (likesCount === 1 ? ' like' : ' likes')}</StyledText>
      {showViewParent && <StyledText color="grey" size="xxsmall">View Parent Post</StyledText>}
      <StyledText color="grey" size="xxsmall">{commentsCount} comments</StyledText>
    </View>
  </TouchableOpacity>
);

PostStatus.defaultProps = {
  showViewParent: false,
  likesCount: 0,
  commentsCount: 0,
  onPress: null,
};
