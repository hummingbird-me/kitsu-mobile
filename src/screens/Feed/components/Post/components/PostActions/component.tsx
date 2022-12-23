import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

const actionButtonLabels = {
  like: 'Like',
  liked: 'Liked',
  comment: 'Comment',
  share: 'Share',
};


interface PostActionButtonProps {
  variant?: "like" | "liked" | "comment" | "share";
  isActive?: boolean;
  onPress?(...args: unknown[]): unknown;
}


/* eslint-disable global-require */
export const PostActionButton = ({
  variant,
  isActive,
  onPress
}: PostActionButtonProps) => {
  const icons = {
    like: require('kitsu/assets/img/feed/heart.png'),
    liked: require('kitsu/assets/img/feed/heart__active.png'),
    comment: require('kitsu/assets/img/feed/comment.png'),
    share: require('kitsu/assets/img/feed/share.png'),
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.postActionButton}>
      <FastImage
        source={icons[variant]}
        resizeMode="cover"
        style={{ width: 20, height: 18 }}
        cache="web"
      />
      <StyledText
        size="xsmall"
        color={isActive ? 'red' : 'grey'}
        textStyle={{ marginLeft: 10 }}
      >
        {actionButtonLabels[variant]}
      </StyledText>
    </TouchableOpacity>
  );
};

PostActionButton.defaultProps = {
  variant: 'like',
  isActive: false,
  onPress: null,
};

interface PostActionsProps {
  isLiked?: boolean;
  onLikePress?(...args: unknown[]): unknown;
  onCommentPress?(...args: unknown[]): unknown;
}

export const PostActions = ({
  isLiked,
  onLikePress,
  onCommentPress /* , onSharePress */
}: PostActionsProps) => (
  <View style={styles.postActionRow}>
    <PostActionButton variant={isLiked ? 'liked' : 'like'} onPress={onLikePress} isActive={isLiked} />
    <PostActionButton variant="comment" onPress={onCommentPress} />
    {/* <PostActionButton variant="share" onPress={onSharePress} /> */}
  </View>
);

PostActions.defaultProps = {
  isLiked: false,
  onLikePress: null,
  onCommentPress: null,
  onSharePress: null,
};
