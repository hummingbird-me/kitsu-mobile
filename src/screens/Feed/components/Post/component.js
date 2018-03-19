import React, { PureComponent } from 'react';
import { FlatList, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { preprocessFeedPosts, preprocessFeedPost } from 'kitsu/utils/preprocessFeed';
import { styles } from './styles';
import { PostHeader, PostMain, PostOverlay, PostActions, CommentFlatList } from './components';
import { isEmpty } from 'lodash';

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
    commentsCount: this.props.post.commentsCount,
    topLevelCommentsCount: this.props.post.topLevelCommentsCount,
    like: null,
    isLiked: false,
    postLikesCount: parseInt(this.props.post.postLikesCount, 10) || 0,
    overlayRemoved: false,
    isPostingComment: false,
  };

  mounted = false

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
      commentsCount: this.state.commentsCount,
      topLevelCommentsCount: this.state.topLevelCommentsCount,
      like: this.state.like,
      isLiked: this.state.isLiked,
      postLikesCount: this.state.postLikesCount,
      currentUser: this.props.currentUser,
      syncComments: (comments) => {
        this.setState({
          comments: [...this.state.comments, ...comments],
          latestComments: [...this.state.latestComments, ...comments],
          commentsCount: this.state.commentsCount + comments.length,
          topLevelCommentsCount: this.state.commentsCount + comments.length
        })
      }
    });
  }

  onCommentChanged = comment => this.setState({ comment })

  onGifSelected = (gif) => {
    if (!(gif && gif.id)) return;
    const gifUrl = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
    const comment = this.state.comment.trim();
    const newComment = isEmpty(comment) ? gifUrl : `${comment}\n${gifUrl}`;
    this.setState({ comment: newComment }, () => {
      // Submit gif if comment was empty
      if (isEmpty(comment)) this.onSubmitComment();
    });
  }

  onSubmitComment = async () => {
    if (isEmpty(this.state.comment.trim()) || this.state.isPostingComment) return;
    this.setState({ isPostingComment: true });

    try {
      const comment = await Kitsu.create('comments', {
        content: this.state.comment.trim(),
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

      const processed = preprocessFeedPost(comment);
      this.setState({
        comment: '',
        comments: [...this.state.comments, processed],
        latestComments: [...this.state.latestComments, processed],
        topLevelCommentsCount: this.state.topLevelCommentsCount + 1,
        commentsCount: this.state.commentsCount + 1
      });
    } catch (error) {
      console.log('Error submitting comment:', error);
    } finally {
      this.setState({ isPostingComment: false });
    }
  }

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
          users: 'slug,avatar,name',
        },
        include: 'user',
        sort: '-createdAt',
      });

      const processed = preprocessFeedPosts(comments);

      if (this.mounted) {
        this.setState({
          latestComments: processed.slice(0, 2).reverse(),
          comments: processed.reverse(),
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
    if (this.commentInput) this.commentInput.focus();
  }

  toggleOverlay = () => {
    this.setState({
      overlayRemoved: !this.state.overlayRemoved,
    });
  }

  render() {
    const { navigation, post, currentUser } = this.props;
    const {
      createdAt,
      content,
      images,
      embed,
      media,
      nsfw,
      spoiler,
      spoiledUnit,
      user,
    } = post;
    const {
      comment,
      latestComments,
      overlayRemoved,
      postLikesCount,
      commentsCount,
      isPostingComment,
    } = this.state;

    const isSpoilerOrNSFW = (spoiler || nsfw);

    // Build the post body based on if we have nsfw/spoiler content
    const postBody = (isSpoilerOrNSFW && !overlayRemoved) ?
      (
        <PostOverlay
          nsfw={nsfw}
          spoiler={spoiler}
          likesCount={postLikesCount}
          commentsCount={commentsCount}
          taggedMedia={media}
          taggedEpisode={spoiledUnit}
          navigation={navigation}
          onPress={this.toggleOverlay}
        />
      )
      :
      (
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

    return (
      <View style={styles.wrap}>
        <TouchableWithoutFeedback onPress={this.onPostPress}>
          <PostHeader
            post={post}
            currentUser={currentUser}
            avatar={(user.avatar && user.avatar.medium) || defaultAvatar}
            onAvatarPress={() => {
              if (user) navigation.navigate('ProfilePages', { userId: user.id });
            }}
            name={user.name}
            time={createdAt}
          />
        </TouchableWithoutFeedback>

        {postBody}

        {(!isSpoilerOrNSFW || overlayRemoved) &&
          // Only show comments if the post is not nsfw or spoiler
          // or if the overlay has been removed.
          <View>
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
                  <CommentFlatList
                    post={post}
                    latestComments={latestComments}
                    hideEmbeds={nsfw && !overlayRemoved}
                    isTruncated
                    navigation={navigation}
                  />
                </PostSection>
              )}

              <PostSection>
                <CommentTextInput
                  currentUser={currentUser}
                  inputRef={(el) => { this.commentInput = el; }}
                  comment={comment}
                  onCommentChanged={this.onCommentChanged}
                  onSubmit={this.onSubmitComment}
                  onGifSelected={this.onGifSelected}
                  loading={isPostingComment}
                  multiline
                />
              </PostSection>
            </PostFooter>
          </View>
        }
      </View>
    );
  }
}

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
