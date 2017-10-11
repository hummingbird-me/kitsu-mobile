import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { styles } from './styles';

// PostHeader
const PostHeader = ({ avatar, name, time }) => {
  const postDateTime = moment().diff(time, 'days') < 2 ? moment(time).calendar() : `${moment(time).format('DD MMM')} at ${moment(time).format('H:MMA')}`;
  return (
    <View style={styles.postHeader}>
      <Layout.RowWrap alignItems="center">
        <Avatar avatar={avatar} />
        <Layout.RowMain>
          <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
          <StyledText color="grey" size="xxsmall" textStyle={{ marginTop: 3 }}>{postDateTime}</StyledText>
        </Layout.RowMain>
        <TouchableOpacity>
          <Icon name="ios-more" color={colors.lightGrey} style={{ fontSize: 32, paddingVertical: 10 }} />
        </TouchableOpacity>
      </Layout.RowWrap>
    </View>
  );
};

PostHeader.propTypes = {
  avatar: PropTypes.string,
  name: PropTypes.string,
  time: PropTypes.string,
};
PostHeader.defaultProps = {
  avatar: null,
  name: null,
  time: null,
};


// PostMain
const PostMain = ({ content, likesCount, commentsCount }) => (
  <View style={styles.postMain}>
    <View style={styles.postContent}>
      <StyledText color="dark" size="small">{content}</StyledText>
    </View>
    <View style={styles.postStatusRow}>
      <View style={styles.postStatus}>
        <StyledText color="grey" size="xxsmall">{likesCount} likes</StyledText>
      </View>
      <View style={styles.postStatus}>
        <StyledText color="grey" size="xxsmall">{commentsCount} comments</StyledText>
      </View>
    </View>
  </View>
);

PostMain.propTypes = {
  content: PropTypes.string,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
};
PostMain.defaultProps = {
  content: null,
  likesCount: 0,
  commentsCount: 0,
};


// PostAction
const actionButtonIcons = {
  like: 'ios-heart-outline',
  comment: 'ios-text-outline',
  share: 'ios-redo-outline',
};
const actionButtonLabels = {
  like: 'Like',
  comment: 'Comment',
  share: 'Share',
};
const PostActionButton = ({ variant, isActive, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.postActionButton}>
    <Icon
      name={actionButtonIcons[variant]}
      color={isActive ? 'red' : 'grey'}
      style={{ fontSize: 18 }}
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

PostActionButton.propTypes = {
  variant: PropTypes.oneOf(['like', 'comment', 'share']),
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
};
PostActionButton.defaultProps = {
  variant: 'like',
  isActive: false,
  onPress: null,
};

const PostAction = ({ isLiked, onLikePress, onCommentPress, onSharePress }) => (
  <View style={styles.postActionRow}>
    <PostActionButton variant="like" onPress={onLikePress} isActive={isLiked} />
    <PostActionButton variant="comment" onPress={onCommentPress} />
    <PostActionButton variant="share" onPress={onSharePress} />
  </View>
);

PostAction.propTypes = {
  isLiked: PropTypes.bool,
  onLikePress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
};
PostAction.defaultProps = {
  isLiked: false,
  onLikePress: null,
  onCommentPress: null,
  onSharePress: null,
};


// Post Footer
const PostFooter = props => <View style={styles.postFooter} {...props} />;
const PostSection = props => <View style={styles.postSection} {...props} />;


// Post
export const Post = ({
  authorAvatar,
  authorName,
  postTime,
  postContent,
  postLikesCount,
  postCommentCount,
  onLikePress,
  onCommentPress,
  onSharePress,
  comments,
}) => (
  <View style={styles.wrap}>
    <PostHeader
      avatar={authorAvatar}
      name={authorName}
      time={postTime}
    />
    <PostMain
      content={postContent}
      likesCount={postLikesCount}
      commentsCount={postCommentCount}
    />
    <PostAction
      onLikePress={onLikePress}
      onCommentPress={onCommentPress}
      onSharePress={onSharePress}
    />
    <PostFooter>
      <PostSection>
        <Comment comment={comments[0]} />
      </PostSection>
      <PostSection>
        <CommentTextInput />
      </PostSection>
    </PostFooter>
  </View>
);


Post.propTypes = {
  authorAvatar: PropTypes.string,
  authorName: PropTypes.string,
  postTime: PropTypes.string,
  postContent: PropTypes.string,
  postLikesCount: PropTypes.number,
  postCommentCount: PropTypes.number,
  onLikePress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
  comments: PropTypes.array,
};

Post.defaultProps = {
  authorAvatar: null,
  authorName: null,
  postTime: null,
  postContent: null,
  postLikesCount: 0,
  postCommentCount: 0,
  onLikePress: null,
  onCommentPress: null,
  onSharePress: null,
  comments: [],
};
