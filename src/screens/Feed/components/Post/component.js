import React, { PureComponent } from 'react';
import { FlatList, View, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { StyledText } from 'kitsu/components/StyledText';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { preprocessFeedPosts, preprocessFeedPost } from 'kitsu/utils/preprocessFeed';
import { isEmpty, uniqBy } from 'lodash';
import { extractUrls } from 'kitsu/utils/url';
import { FeedCache } from 'kitsu/utils/cache';
import { Navigation } from 'react-native-navigation';
import { Screens, NavigationActions } from 'kitsu/navigation';
import { styles } from './styles';
import { PostHeader, PostMain, PostOverlay, PostActions, CommentFlatList } from './components';

// Post
export class Post extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    post: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    onPostPress: PropTypes.func,
  }

  static defaultProps = {
    onPostPress: null,
  }

  state = {
    post: this.props.post,
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
    isDeleted: false,
    embedUrl: null,
  };

  mounted = false

  componentDidMount() {
    this.mounted = true;

    this.restoreCache();
    this.fetchComments();
    this.fetchLikes();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPostPress = () => {
    this.props.onPostPress({
      post: this.state.post,
      comments: this.state.comments,
      commentsCount: this.state.commentsCount,
      topLevelCommentsCount: this.state.topLevelCommentsCount,
      like: this.state.like,
      isLiked: this.state.isLiked,
      postLikesCount: this.state.postLikesCount,
      currentUser: this.props.currentUser,
      syncComments: (comments) => {
        const uniqueComments = uniqBy([...this.state.comments, ...comments], 'id');
        FeedCache.setComments(this.state.post.id, uniqueComments);
        this.setState({
          comments: uniqueComments,
          latestComments: [...this.state.latestComments, ...comments],
          commentsCount: this.state.commentsCount + comments.length,
          topLevelCommentsCount: this.state.commentsCount + comments.length,
        });
      },
    });
  }

  onCommentChanged = comment => this.setState({ comment })

  onGifSelected = (gif) => {
    if (!(gif && gif.id)) return;
    const gifUrl = `https://giphy.com/gifs/${gif.id}`;
    const comment = this.state.comment.trim();
    const newComment = isEmpty(comment) ? gifUrl : `${comment}\n${gifUrl}`;
    this.setState({ comment: newComment, embedUrl: gifUrl }, () => {
      // Submit gif if comment was empty
      if (isEmpty(comment)) this.onSubmitComment();
    });
  }

  onSubmitComment = async () => {
    if (isEmpty(this.state.comment.trim()) || this.state.isPostingComment) return;
    this.setState({ isPostingComment: true });

    // Update the embed
    let embedUrl = this.state.embedUrl;

    // If we don't have an embed set then use the first link
    const links = extractUrls(this.state.comment.trim());
    if (isEmpty(embedUrl) && links.length > 0) {
      embedUrl = links[0];
    }

    try {
      const comment = await Kitsu.create('comments', {
        content: this.state.comment.trim(),
        embedUrl,
        post: {
          id: this.state.post.id,
          type: 'posts',
        },
        user: {
          id: this.props.currentUser.id,
          type: 'users',
        },
      });
      comment.user = this.props.currentUser;

      const processed = preprocessFeedPost(comment);
      const uniqueComments = uniqBy([...this.state.comments, processed], 'id');

      FeedCache.setComments(this.state.post.id, uniqueComments);

      this.setState({
        embedUrl: null,
        comment: '',
        comments: uniqueComments,
        latestComments: [...this.state.latestComments, processed],
        topLevelCommentsCount: this.state.topLevelCommentsCount + 1,
        commentsCount: this.state.commentsCount + 1,
      });
    } catch (error) {
      console.log('Error submitting comment:', error);
    } finally {
      this.setState({ isPostingComment: false });
    }
  }

  restoreCache() {
    const id = this.state.post.id;

    // Get the comments and flip them so that they're newest to oldest.
    const comments = (FeedCache.getComments(id) || []).reverse();
    const like = FeedCache.getLike(id) || null;

    this.setState({
      latestComments: comments.slice(0, 2).reverse(),
      comments: comments.reverse(),
      like,
      isLiked: !!like,
    });
  }

  fetchComments = async () => {
    try {
      // We go ahead and fetch the comments so if the user wants to view detail
      // they can do so without a refetch.
      // This will order the comments by newest first.
      const comments = await Kitsu.findAll('comments', {
        filter: {
          postId: this.state.post.id,
          parentId: '_none',
        },
        fields: {
          users: 'slug,avatar,name',
        },
        include: 'user,uploads',
        sort: '-createdAt',
      });

      const processed = preprocessFeedPosts(comments);
      const uniqueComments = uniqBy(processed, 'id');

      // Store the comments in the right order (oldest - newest)
      FeedCache.setComments(this.state.post.id, [...uniqueComments].reverse());

      if (this.mounted) {
        this.setState({
          latestComments: uniqueComments.slice(0, 2).reverse(),
          comments: uniqueComments.reverse(),
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
          postId: this.state.post.id,
          userId: this.props.currentUser.id,
        },
        include: 'user',
      });

      const like = likes.length && likes[0];
      if (like) {
        FeedCache.setLike(this.state.post.id, like);
      }

      if (this.mounted) {
        this.setState({ like, isLiked: !!like });
      }
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  }

  toggleLike = async () => {
    try {
      const { currentUser } = this.props;
      let { like, isLiked, post, postLikesCount } = this.state;

      // Optimistically update our UI
      this.setState({
        isLiked: !isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });

      if (like) {
        await Kitsu.destroy('postLikes', like.id);
        FeedCache.deleteLike(post.id);
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
        FeedCache.setLike(post.id, like);
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

  deletePost = async () => {
    try {
      const { post } = this.state;
      this.setState({ isDeleted: true });
      await Kitsu.destroy('posts', post.id);
    } catch (err) {
      console.log('Error deleting post:', err);
      this.setState({ isDeleted: false });
      Alert.alert('Sorry', 'There was an issue deleting the post.', [
        { text: 'OK', onPress: null },
      ]);
    }
  };

  toggleEditor = () => {
    if (this.props.currentUser) {
      NavigationActions.showCreatePostModal({
        isEditing: true,
        post: this.state.post,
        onPostCreated: (post) => {
          const processed = preprocessFeedPost(post);
          this.setState({ post: processed });
        },
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
    const { currentUser, componentId } = this.props;
    const {
      post,
      comment,
      latestComments,
      overlayRemoved,
      postLikesCount,
      commentsCount,
      isPostingComment,
      isDeleted,
    } = this.state;
    const {
      id,
      updatedAt,
      createdAt,
      content,
      embed,
      media,
      nsfw,
      spoiler,
      spoiledUnit,
      user,
      uploads,
    } = post;
    if (isDeleted) { return null; }

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
          componentId={componentId}
          onPress={this.toggleOverlay}
        />
      )
      :
      (
        <PostMain
          cacheKey={`${id}-${updatedAt}`}
          content={content}
          embed={embed}
          uploads={uploads}
          likesCount={postLikesCount}
          commentsCount={commentsCount}
          taggedMedia={media}
          taggedEpisode={spoiledUnit}
          componentId={componentId}
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
              if (user) {
                Navigation.push(componentId, {
                  component: {
                    name: Screens.PROFILE_PAGE,
                    passProps: { userId: user.id },
                  },
                });
              }
            }}
            onEditPress={this.toggleEditor}
            onDelete={this.deletePost}
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
                    componentId={componentId}
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
