import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import moment from 'moment';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { PostImage, PostImageSeparator } from 'kitsu/screens/Feed/components/PostImage';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { scene } from 'kitsu/screens/Feed/constants';
import { styles } from './styles';

// Post
export class Post extends PureComponent {
  static propTypes = {
    post: PropTypes.object,
    currentUser: PropTypes.object,
    onPostPress: PropTypes.func,
    navigateToUserProfile: PropTypes.func,
  }

  static defaultProps = {
    post: {},
    currentUser: {},
    onPostPress: null,
    navigateToUserProfile: null,
  }

  state = {
    comments: [],
    isLiked: false,
  }

  componentWillMount() {
    this.mounted = true;

    this.fetchComments();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPostPress = () => {
    this.props.onPostPress({
      post: this.props.post,
      comments: this.state.comments,
    });
  }

  mounted = false

  fetchComments = async () => {
    try {
      const comments = await Kitsu.findAll('comments', {
        filter: {
          postId: this.props.post.id,
        },
        fields: {
          users: 'avatar,name',
        },
        include: 'user',
        sort: 'createdAt',
      });

      // TODO: Comments come in without any structure.
      // We need to hook them up with parent / child comments,
      // but Devour doesn't seem to do this correctly:
      // https://github.com/twg/devour/issues/90
      // and there's no way for me to access the relationship
      // data from the raw response from this context.

      if (this.mounted) this.setState({ comments });
    } catch (err) {
      console.log('Error fetching comments: ', err);
    }
  }

  toggleLike = () => {
    this.setState({ isLiked: !this.state.isLiked });
  }

  focusOnCommentInput = () => {
    this.commentInput.focus();
  }

  navigateToUserProfile = (userId) => {
    this.prop.navigation.navigate('Profile', { userId });
  }

  render() {
    const {
      createdAt,
      content,
      images,
      postLikesCount,
      commentsCount,
      user,
    } = this.props.post;
    const { comments } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onPostPress}>
        <View style={styles.wrap}>
          <PostHeader
            avatar={(user.avatar && user.avatar.medium) || defaultAvatar}
            onAvatarPress={() => this.props.navigateToUserProfile(user.id)}
            name={user.name}
            time={createdAt}
          />

          <PostMain
            content={content}
            images={images}
            likesCount={postLikesCount}
            commentsCount={commentsCount}
          />

          <PostActions
            isLiked={this.state.isLiked}
            onLikePress={this.toggleLike}
            onCommentPress={this.focusOnCommentInput}
            onSharePress={() => {}}
          />

          <PostFooter>
            {!comments &&
              <Text>Loading...</Text>
            }
            {comments && comments.map(comment => (
              <PostSection key={`comment:${comment.id}`}>
                <Comment
                  comment={comment}
                />
              </PostSection>
            ))}

            <PostSection>
              <CommentTextInput
                currentUser={this.props.currentUser}
                inputRef={(el) => { this.commentInput = el; }}
              />
            </PostSection>
          </PostFooter>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

// PostHeader
export const PostHeader = ({ avatar, onAvatarPress, name, time, onBackButtonPress }) => {
  const postDateTime = moment().diff(time, 'days') < 2 ? moment(time).calendar() : `${moment(time).format('DD MMM')} at ${moment(time).format('H:MMA')}`;
  return (
    <View style={styles.postHeader}>
      <Layout.RowWrap alignItems="center">
        {onBackButtonPress && (
          <TouchableOpacity onPress={onBackButtonPress} style={styles.postHeaderBackButton}>
            <Icon name="ios-arrow-back" color={colors.listBackPurple} style={{ fontSize: 28 }} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onAvatarPress} style={styles.userDetailsLink}>
          <Avatar avatar={avatar} />
          <Layout.RowMain>
            <StyledText color="dark" size="xsmall" bold>{name}</StyledText>
            <StyledText color="grey" size="xxsmall" textStyle={{ marginTop: 3 }}>{postDateTime}</StyledText>
          </Layout.RowMain>
        </TouchableOpacity>
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
  onBackButtonPress: PropTypes.func,
  onAvatarPress: PropTypes.func,
};
PostHeader.defaultProps = {
  avatar: null,
  name: null,
  time: null,
  onBackButtonPress: null,
  onAvatarPress: null,
};

// PostMain
export const PostMain = ({ content, images, likesCount, commentsCount }) => (
  <View style={styles.postMain}>
    <View style={styles.postContent}>
      <StyledText color="dark" size="small">{content}</StyledText>
    </View>
    {images && images.length > 0 && (
      <FlatList
        keyExtractor={({ index }) => index}
        style={[styles.postImagesView, !content && styles.posImagesView__noText]}
        data={images}
        renderItem={({ item }) => <PostImage uri={item} width={scene.width} />}
        ItemSeparatorComponent={() => <PostImageSeparator />}
      />
    )}
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
  images: PropTypes.array,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
};
PostMain.defaultProps = {
  content: null,
  images: [],
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
export const PostActionButton = ({ variant, isActive, onPress }) => (
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

export const PostActions = ({ isLiked, onLikePress, onCommentPress, onSharePress }) => (
  <View style={styles.postActionRow}>
    <PostActionButton variant="like" onPress={onLikePress} isActive={isLiked} />
    <PostActionButton variant="comment" onPress={onCommentPress} />
    <PostActionButton variant="share" onPress={onSharePress} />
  </View>
);

PostActions.propTypes = {
  isLiked: PropTypes.bool,
  onLikePress: PropTypes.func,
  onCommentPress: PropTypes.func,
  onSharePress: PropTypes.func,
};
PostActions.defaultProps = {
  isLiked: false,
  onLikePress: null,
  onCommentPress: null,
  onSharePress: null,
};


// Post Footer
export const PostFooter = props => <View style={styles.postFooter} {...props} />;
export const PostSection = props => <View style={styles.postSection} {...props} />;
export const PostCommentsSection = props => <View style={styles.postCommentsSection} {...props} />;
