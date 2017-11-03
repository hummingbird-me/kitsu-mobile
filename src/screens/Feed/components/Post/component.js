import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import Icon from 'react-native-vector-icons/Ionicons';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { PostImage, PostImageSeparator } from 'kitsu/screens/Feed/components/PostImage';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { scene } from 'kitsu/screens/Feed/constants';
import { styles } from './styles';

// Post
export class Post extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    onPostPress: PropTypes.func,
    navigation: PropTypes.func,
  }

  static defaultProps = {
    onPostPress: null,
    navigation: null,
  }

  state = {
    comment: '',
    comments: [],
    latestComment: null,
    like: null,
    taggedMedia: {
      media: {
        canonicalTitle: 'Made in Abyss',
      },
      episode: 1,
    },
  };

  componentWillMount() {
    this.mounted = true;

    this.fetchComments();
    this.fetchLikes();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPostPress = () => {
    this.props.onPostPress({
      post: this.props.post,
      comments: this.state.comments,
      like: this.state.like,
      currentUser: this.props.currentUser,
    });
  }

  onCommentChanged = comment => this.setState({ comment })

  onSubmitComment = async () => {
    await Kitsu.create('comments', {
      content: this.state.comment,
      post: {
        id: this.props.post.id,
        type: 'posts',
      },
      user: {
        id: this.props.currentUser.id,
        type: 'users',
      },
    });

    this.setState({ comment: '' });
    this.fetchComments();
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

      const latestComment = comments.length && comments[0];

      if (this.mounted) this.setState({ latestComment, comments });
    } catch (err) {
      console.log('Error fetching comments: ', err);
    }
  }

  fetchLikes = async () => {
    try {
      const likes = await Kitsu.findAll('postLikes', {
        filter: {
          postId: this.props.post.id,
          userId: this.props.currentUser.id,
        },
        include: 'user',
        page: {
          limit: 4,
        },
      });

      const like = likes.length && likes[0];

      if (this.mounted) this.setState({ like });
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  }

  toggleLike = async () => {
    let { like } = this.state;

    if (like) {
      this.setState({ like: null });

      await Kitsu.destroy('postLikes', like.id);
    } else {
      like = await Kitsu.create('postLikes', {
        post: {
          id: this.props.post.id,
          type: 'posts',
        },
        user: {
          id: this.props.currentUser.id,
          type: 'users',
        },
      });

      this.setState({ like });
    }
  }

  focusOnCommentInput = () => {
    this.commentInput.focus();
  }

  render() {
    const { navigation } = this.props;
    const {
      createdAt,
      content,
      images,
      postLikesCount,
      commentsCount,
      user,
    } = this.props.post;
    const { comment, latestComment, comments, taggedMedia } = this.state;

    return (
      <TouchableWithoutFeedback onPress={this.onPostPress}>
        <View style={styles.wrap}>
          <PostHeader
            avatar={(user.avatar && user.avatar.medium) || defaultAvatar}
            onAvatarPress={() => navigation.navigate('ProfilePages', { userId: user.id })}
            name={user.name}
            time={createdAt}
          />

          <PostMain
            content={content}
            images={images}
            likesCount={postLikesCount}
            commentsCount={commentsCount}
            taggedMedia={taggedMedia}
            navigation={navigation}
          />

          <PostActions
            isLiked={!!this.state.like}
            onLikePress={this.toggleLike}
            onCommentPress={this.focusOnCommentInput}
            onSharePress={() => {}}
          />

          <PostFooter>
            {!comments &&
              <SceneLoader />
            }
            {(comments && latestComment) && (
              <PostSection>
                <Comment comment={latestComment} isTruncated />
              </PostSection>
            )}

            <PostSection>
              <CommentTextInput
                currentUser={this.props.currentUser}
                inputRef={(el) => { this.commentInput = el; }}
                comment={comment}
                onCommentChanged={this.onCommentChanged}
                onSubmit={this.onSubmitComment}
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
  const ACTION_OPTIONS = ['Copy link to post', 'Follow post', `Hide post from ${name}`, 'Report Post', `Block ${name}`, 'Never mind'];
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

        {/* Todo KB: hook up with real action for each options */}
        <SelectMenu
          options={ACTION_OPTIONS}
          onOptionSelected={() => {}}
          activeOpacity={0.8}
        >
          <Icon name="ios-more" color={colors.lightGrey} style={{ fontSize: 32, paddingVertical: 10 }} />
        </SelectMenu>
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
const keyExtractor = (item, index) => index;

// Media Tag
export const MediaTag = ({ media, episode, navigation }) => (
  <View style={styles.mediaTagView}>
    <TouchableOpacity
      onPress={() => navigation.navigate('MediaPages', { mediaId: media.id, mediaType: media.type })}
      style={styles.mediaTag}
    >
      <StyledText color="green" size="xxsmall">{media.canonicalTitle}</StyledText>
    </TouchableOpacity>
    {episode && (
      <TouchableOpacity
        onPress={() => navigation.navigate('MediaPages', { mediaId: media.id, mediaType: media.type })}
        style={styles.episodeTagView}
      >
        <View style={styles.episodeTagLine} />
        <View style={styles.mediaTag}>
          <StyledText color="green" size="xxsmall">{`E ${episode}`}</StyledText>
        </View>
      </TouchableOpacity>
    )}
  </View>
);

MediaTag.propTypes = {
  media: PropTypes.shape({
    canonicalTitle: PropTypes.string,
  }).isRequired,
  episode: PropTypes.number,
  navigation: PropTypes.func,
};

MediaTag.defaultProps = {
  episode: null,
  navigation: null,
};

export const PostMain = ({
  content,
  images,
  likesCount,
  commentsCount,
  taggedMedia,
  navigation,
}) => (
  <View style={styles.postMain}>
    <View style={styles.postContent}>
      <StyledText color="dark" size="small">{content}</StyledText>
    </View>
    {images && images.length > 0 && (
      <FlatList
        keyExtractor={keyExtractor}
        style={[styles.postImagesView, !content && styles.posImagesView__noText]}
        data={images}
        renderItem={({ item }) => <PostImage uri={item} width={scene.width} />}
        ItemSeparatorComponent={() => <PostImageSeparator />}
      />
    )}
    {taggedMedia && (
      <MediaTag
        media={taggedMedia.media}
        episode={taggedMedia.episode}
        navigation={navigation}
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
  taggedMedia: PropTypes.object,
  navigation: PropTypes.func,
};
PostMain.defaultProps = {
  content: null,
  images: [],
  likesCount: 0,
  commentsCount: 0,
  taggedMedia: null,
  navigation: null,
};

const actionButtonLabels = {
  like: 'Like',
  liked: 'Liked',
  comment: 'Comment',
  share: 'Share',
};


/* eslint-disable global-require */
export const PostActionButton = ({ variant, isActive, onPress }) => {
  const icons = {
    like: require('kitsu/assets/img/feed/heart.png'),
    liked: require('kitsu/assets/img/feed/heart__active.png'),
    comment: require('kitsu/assets/img/feed/comment.png'),
    share: require('kitsu/assets/img/feed/share.png'),
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.postActionButton}>
      <Image
        source={icons[variant]}
        resizeMode="cover"
        style={{ width: 20, height: 18 }}
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

PostActionButton.propTypes = {
  variant: PropTypes.oneOf(['like', 'liked', 'comment', 'share']),
  isActive: PropTypes.bool,
  onPress: PropTypes.func,
};
PostActionButton.defaultProps = {
  variant: 'like',
  isActive: false,
  onPress: null,
};

export const PostActions = ({ isLiked, onLikePress, onCommentPress /* , onSharePress */ }) => (
  <View style={styles.postActionRow}>
    <PostActionButton variant={isLiked ? 'liked' : 'like'} onPress={onLikePress} isActive={isLiked} />
    <PostActionButton variant="comment" onPress={onCommentPress} />
    {/* <PostActionButton variant="share" onPress={onSharePress} /> */}
  </View>
);

PostActions.propTypes = {
  isLiked: PropTypes.bool,
  onLikePress: PropTypes.func,
  onCommentPress: PropTypes.func,
  // onSharePress: PropTypes.func,
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
