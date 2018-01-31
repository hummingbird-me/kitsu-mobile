import React, { PureComponent } from 'react';
import { FlatList, Image, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import YouTube from 'react-native-youtube';

import moment from 'moment';

import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { SelectMenu } from 'kitsu/components/SelectMenu';
import { StyledText } from 'kitsu/components/StyledText';
import { Avatar } from 'kitsu/screens/Feed/components/Avatar';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { PostImage, PostImageSeparator } from 'kitsu/screens/Feed/components/PostImage';
import * as Layout from 'kitsu/screens/Feed/components/Layout';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { MediaTag } from 'kitsu/screens/Feed/components/MediaTag';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { scene } from 'kitsu/screens/Feed/constants';
import { styles } from './styles';

import { Spoiler } from './PostOverlays/Spoiler';
import { NotSafeForWork } from './PostOverlays/NotSafeForWork';

// Post
export class Post extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    onPostPress: PropTypes.func,
    navigation: PropTypes.object.isRequired,
  }

  static defaultProps = {
    onPostPress: null,
  }

  state = {
    comment: '',
    comments: [],
    latestComments: [],
    like: null,
    isLiked: false,
    postLikesCount: this.props.post.postLikesCount,
    overlayRemoved: false,
  };

  componentDidMount() {
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
      isLiked: this.state.isLiked,
      postLikesCount: this.state.postLikesCount,
      currentUser: this.props.currentUser,
    });
  }

  onCommentChanged = comment => this.setState({ comment })

  onGifSelected = (gif) => {
    this.setState({ comment: gif.images.original.url  }, () => {
      this.onSubmitComment();
    });
  }

  onSubmitComment = async () => {
    const comment = await Kitsu.create('comments', {
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
    comment.user = this.props.currentUser;

    this.setState({
      comment: '',
      comments: [...this.state.comments, comment],
      latestComments: [...this.state.latestComments, comment]
    });
  }

  mounted = false

  fetchComments = async () => {
    try {
      // We go ahead and fetch the comments so if the user wants to view detail
      // they can do so without a refetch.
      const comments = await Kitsu.findAll('comments', {
        filter: {
          postId: this.props.post.id,
          parentId: '_none',
        },
        fields: {
          users: 'avatar,name',
        },
        include: 'user',
        sort: '-createdAt',
      });

      if (this.mounted) {
        this.setState({
          latestComments: comments.slice(0, 2).reverse(),
          comments: comments.reverse(),
        });
      }
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
      });

      const like = likes.length && likes[0];
      if (this.mounted) {
        this.setState({ like, isLiked: !!like });
      }
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  }

  toggleLike = async () => {
    try {
      const { currentUser, post } = this.props;
      let { like, isLiked, postLikesCount } = this.state;

      this.setState({
        isLiked: !isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });

      if (like) {
        await Kitsu.destroy('postLikes', like.id);
        this.setState({ like: null });
      } else {
        like = await Kitsu.create('postLikes', {
          post: {
            id: post.id,
            type: 'posts',
          },
          user: {
            id: currentUser.id,
            type: 'users',
          },
        });

        this.setState({ like });
      }
    } catch (err) {
      console.log('Error toggling like: ', err);
      const { isLiked, postLikesCount } = this.state;
      this.setState({
        isLiked: !isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });
    }
  };

  focusOnCommentInput = () => {
    this.commentInput.focus();
  }

  toggleOverlay = () => {
    this.setState({
      overlayRemoved: !this.state.overlayRemoved,
    });
  }

  render() {
    const { navigation } = this.props;
    const {
      createdAt,
      content,
      images,
      embed,
      media,
      nsfw,
      spoiler,
      spoiledUnit,
      commentsCount,
      user,
    } = this.props.post;
    const { comment, latestComments, overlayRemoved, postLikesCount } = this.state;

    let postBody = null;

    if (spoiler && !overlayRemoved) {
      postBody = <Spoiler onPress={this.toggleOverlay} />;
    } else if (nsfw && !overlayRemoved) {
      postBody = <NotSafeForWork onPress={this.toggleOverlay} />;
    } else {
      postBody = (
        <PostMain
          content={content}
          images={images}
          embed={embed}
          likesCount={postLikesCount}
          commentsCount={commentsCount}
          taggedMedia={media}
          taggedEpisode={spoiledUnit}
          navigation={navigation}
          onPress={this.onPostPress}
        />
      );
    }

    return (
      <View style={styles.wrap}>
        <TouchableWithoutFeedback onPress={this.onPostPress}>
          <PostHeader
            avatar={(user.avatar && user.avatar.medium) || defaultAvatar}
            onAvatarPress={() => navigation.navigate('ProfilePages', { userId: user.id })}
            name={user.name}
            time={createdAt}
          />
        </TouchableWithoutFeedback>

        {postBody}

        <PostActions
          isLiked={this.state.isLiked}
          onLikePress={this.toggleLike}
          onCommentPress={this.focusOnCommentInput}
          onSharePress={() => {}}
        />

        <PostFooter>
          {commentsCount > 0 && latestComments.length === 0 &&
            <SceneLoader />
          }
          {latestComments.length > 0 && (
            <PostSection>
              <FlatList
                data={latestComments}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => {
                  return <Comment
                    post={this.props.post}
                    comment={item}
                    onAvatarPress={() => navigation.navigate('ProfilePages', { userId: user.id })}
                    isTruncated
                  />
                }}
                ItemSeparatorComponent={() => <View style={{ height: 17 }} />}
              />
            </PostSection>
          )}

          <PostSection>
            <CommentTextInput
              currentUser={this.props.currentUser}
              inputRef={(el) => { this.commentInput = el; }}
              comment={comment}
              onCommentChanged={this.onCommentChanged}
              onSubmit={this.onSubmitComment}
              onGifSelected={this.onGifSelected}
            />
          </PostSection>
        </PostFooter>
      </View>
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

export const PostMain = ({
  content,
  images,
  embed,
  likesCount,
  commentsCount,
  taggedMedia,
  taggedEpisode,
  navigation,
  onPress,
}) => {
  let youTubeVideoId = null;
  if (embed && embed.video && embed.site_name === 'YouTube') {
    const chunks = embed.video.url.split('/');
    youTubeVideoId = chunks[chunks.length - 1];
  }

  return (
    <View style={styles.postMain}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.postContent}>
          <StyledText color="dark" size="small">{content}</StyledText>
        </View>
      </TouchableWithoutFeedback>
      {images && images.length > 0 && (
        <FlatList
          keyExtractor={keyExtractor}
          style={[styles.postImagesView, !content && styles.posImagesView__noText]}
          data={images}
          renderItem={({ item }) => <PostImage uri={item} width={scene.width} />}
          ItemSeparatorComponent={() => <PostImageSeparator />}
        />
      )}
      {youTubeVideoId && (
        <YouTube
          videoId={youTubeVideoId}
          modestBranding
          rel={false}
          style={styles.youTubeEmbed}
        />
      )}
      {taggedMedia && (
        <MediaTag
          media={taggedMedia}
          episode={taggedEpisode}
          navigation={navigation}
        />
      )}
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.postStatusRow}>
          <View style={styles.postStatus}>
            <StyledText color="grey" size="xxsmall">{likesCount} likes</StyledText>
          </View>
          <View style={styles.postStatus}>
            <StyledText color="grey" size="xxsmall">{commentsCount} comments</StyledText>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

PostMain.propTypes = {
  content: PropTypes.string,
  images: PropTypes.array,
  embed: PropTypes.object,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  taggedMedia: PropTypes.object,
  taggedEpisode: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  onPress: PropTypes.func,
};
PostMain.defaultProps = {
  content: null,
  images: [],
  embed: null,
  likesCount: 0,
  commentsCount: 0,
  taggedMedia: null,
  taggedEpisode: null,
  onPress: null,
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

export const PostReplyBanner = ({ name, onClose }) => (
  <View style={styles.postReplyBanner}>
    <StyledText size="xsmall" color="grey">
      Replying to {name}
    </StyledText>
    <TouchableOpacity onPress={onClose}>
      <StyledText size="large" color="grey">X</StyledText>
    </TouchableOpacity>
  </View>
);

PostReplyBanner.propTypes = {
  name: PropTypes.string,
  onClose: PropTypes.func,
};
PostReplyBanner.defaultProps = {
  name: '',
  onClose: null,
};


// Post Footer
export const PostFooter = props => <View style={styles.postFooter} {...props} />;
export const PostSection = props => <View style={styles.postSection} {...props} />;
export const PostCommentsSection = props => <View style={styles.postCommentsSection} {...props} />;
