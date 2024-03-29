import { isEmpty, isNull, uniqBy } from 'lodash';
import React, { PureComponent } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { SceneLoader } from 'kitsu/components/SceneLoader';
import { StyledText } from 'kitsu/components/StyledText';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar, statusBarHeight } from 'kitsu/constants/app';
import * as colors from 'kitsu/constants/colors';
import { NavigationActions, Screens } from 'kitsu/navigation';
import {
  Comment,
  CommentPagination,
} from 'kitsu/screens/Feed/components/Comment';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import {
  PostCommentsSection,
  PostFooter,
  PostReplyBanner,
  PostSection,
} from 'kitsu/screens/Feed/components/Post';
import {
  PostActions,
  PostHeader,
  PostMain,
} from 'kitsu/screens/Feed/components/Post/components';
import { scenePadding } from 'kitsu/screens/Feed/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import {
  preprocessFeedPost,
  preprocessFeedPosts,
} from 'kitsu/utils/preprocessFeed';
import { extractUrls } from 'kitsu/utils/url';

interface PostDetailsProps {
  componentId: any;
  currentUser: object;
  post: object;
  postLikesCount?: string | number;
  comments?: object[];
  topLevelCommentsCount?: number;
  commentsCount?: number;
  like?: object;
  isLiked?: boolean;
  syncComments?(...args: unknown[]): unknown;
  showLoadMoreComments?: boolean;
}

export default class PostDetails extends PureComponent<PostDetailsProps> {
  static defaultProps = {
    postLikesCount: 0,
    comments: [],
    topLevelCommentsCount: null,
    commentsCount: null,
    like: null,
    isLiked: false,
    syncComments: null,
    showLoadMoreComments: false,
  };

  static options() {
    return {
      layout: {
        backgroundColor: 'white',
      },
    };
  }

  constructor(props) {
    super(props);

    const { post, postLikesCount, comments, like, isLiked } = props;
    const postLikes =
      parseInt(postLikesCount, 10) ||
      parseInt(post.postLikesCount, 10) ||
      parseInt(post.likesCount, 10) ||
      0;

    const topLevelCommentsCount =
      parseInt(props.topLevelCommentsCount, 10) ||
      parseInt(post.topLevelCommentsCount, 10) ||
      parseInt(post.repliesCount, 10) ||
      0;

    const commentsCount =
      parseInt(props.commentsCount, 10) ||
      parseInt(post.commentsCount, 10) ||
      parseInt(post.repliesCount, 10) ||
      0;

    /**
     * Because we can also edit a post on this screen, we have to move the post from props to state
     * to allow the UI to give us the updated post content when we successfully edit the post.
     *
     * TODO: sync post content back to main feed when hitting back button?
     */

    this.state = {
      post: post,
      comment: '',
      comments,
      topLevelCommentsCount,
      commentsCount,
      like,
      isLiked,
      postLikesCount: postLikes,
      isLoadingNextPage: false,
      isReplying: false,
      isPostingComment: false,
      embedUrl: null,
      showLoadMoreComments: props.showLoadMoreComments,
      isLoadingComments: false,
    };
  }

  componentDidMount() {
    const { comments, like } = this.props;
    if (!comments || comments.length === 0) {
      this.fetchComments();
    }
    if (!like) {
      this.fetchLikes();
    }
  }

  onViewAllComment = () => {
    if (this.state.isLoadingComments) return;

    this.setState({ comments: [], showLoadMoreComments: false }, () => {
      this.fetchComments();
    });
  };

  onCommentChanged = (comment) => this.setState({ comment });

  onGifSelected = (gif) => {
    if (!(gif && gif.id)) return;
    const gifUrl = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
    const comment = this.state.comment.trim();
    const newComment = isEmpty(comment) ? gifUrl : `${comment}\n${gifUrl}`;
    this.setState({ comment: newComment, embedUrl: gifUrl }, () => {
      // Submit gif if comment was empty
      if (isEmpty(comment)) this.onSubmitComment();
    });
  };

  onSubmitComment = async () => {
    if (isEmpty(this.state.comment.trim()) || this.state.isPostingComment)
      return;

    const { currentUser, syncComments } = this.props;
    const { post } = this.state;

    const isComment = post.type === 'comments';

    this.setState({ isPostingComment: true });

    try {
      // Update the embed
      let embedUrl = this.state.embedUrl;

      // If we don't have an embed set then use the first link
      const links = extractUrls(this.state.comment.trim());
      if (isEmpty(embedUrl) && links.length > 0) {
        embedUrl = links[0];
      }

      // If we have a reply ref then use that as the parent comment otherwise
      // If we have a comment as the main `post` then use its id
      let commentId = null;
      if (this.replyRef) {
        commentId = this.replyRef.comment.id;
      } else if (isComment) {
        const comment = post.parent ? post.parent : post;
        commentId = comment.id;
      }

      // Check if this is a reply rather than a top-level comment
      let replyOptions = {};
      if (commentId) {
        replyOptions = {
          parent: {
            id: commentId,
            type: 'comments',
          },
          ...replyOptions,
        };
      }

      // If we have a comment as the `post` then we need to use its original post id
      const postId = isComment ? post.post && post.post.id : post.id;
      if (!postId) return;

      const comment = await Kitsu.create('comments', {
        content: this.state.comment.trim(),
        embedUrl,
        post: {
          id: postId,
          type: 'posts',
        },
        user: {
          id: currentUser.id,
          type: 'users',
        },
        ...replyOptions,
      });
      comment.user = currentUser;

      const processed = preprocessFeedPost(comment);
      this.setState({
        embedUrl: null,
        comment: '',
        isReplying: false,
        commentsCount: this.state.commentsCount + 1,
      });

      // If we have a reply ref and the main `post` is not a comment
      // Then trigger the callback
      const shouldCallReplyRefCallback = this.replyRef && !isComment;
      if (shouldCallReplyRefCallback) {
        this.replyRef.callback(comment);
        this.replyRef = null;
      } else {
        this.replyRef = null;
        const uniqueComments = uniqBy(
          [...this.state.comments, processed],
          'id'
        );
        this.setState({
          comments: uniqueComments,
          topLevelCommentsCount: this.state.topLevelCommentsCount + 1,
        });

        // This is a top-level comment, we want to let the upstream
        // component know that this exists without a re-fetch.
        // @Hack
        if (syncComments) {
          syncComments([processed]);
        }
      }
    } catch (err) {
      console.log('Error submitting comment: ', err);
    } finally {
      this.setState({ isPostingComment: false });
    }
  };

  onPagination = async () => {
    this.setState({ isLoadingNextPage: true });
    await this.fetchComments({
      page: {
        offset: this.state.comments.length,
      },
    });
    this.setState({ isLoadingNextPage: false });
  };

  onReplyPress = (comment, user, callback) => {
    const mention = user.slug || user.id;
    const name = user.name;
    this.setState({
      comment: `@${mention} `,
      isReplying: true,
    });

    // If the comment has a parent then use that as the parent comment too
    const refComment = comment && comment.parent ? comment.parent : comment;
    this.replyRef = { comment: refComment, mention, name, callback };
    this.focusOnCommentInput();
  };

  onViewParentPress = () => {
    const { currentUser, componentId } = this.props;
    const { post } = this.state;

    if (!post || !post.post) return;

    Navigation.push(componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: {
          post: post.post,
          comments: [],
          like: null,
          currentUser,
        },
      },
    });
  };

  toggleLike = async () => {
    try {
      const { currentUser } = this.props;
      let { post, like, isLiked, postLikesCount } = this.state;

      const isComment = post.type === 'comments';
      const likesEndpoint = isComment ? 'commentLikes' : 'postLikes';

      this.setState({
        isLiked: !isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });

      if (like) {
        await Kitsu.destroy(likesEndpoint, like.id);
        this.setState({ like: null });
      } else {
        const relationship = isComment
          ? {
              comment: {
                id: post.id,
                type: 'comments',
              },
            }
          : {
              post: {
                id: post.id,
                type: 'posts',
              },
            };

        like = await Kitsu.create(likesEndpoint, {
          ...relationship,
          user: {
            id: currentUser.id,
            type: 'users',
          },
        });

        this.setState({ like });
      }
    } catch (err) {
      console.log('Error toggling like: ', err);
      this.setState({
        isLiked: !this.state.isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });
    }
  };

  deletePost = async () => {
    try {
      const { post } = this.state;
      await Kitsu.destroy('posts', post.id);
      // TODO: give user feedback when post deleted (go back to Feed?)
    } catch (err) {
      console.log('Error deleting post:', err);
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

  fetchComments = async (requestOptions = {}) => {
    this.setState({ isLoadingComments: true });
    try {
      const { post } = this.state;

      let filter = {};

      // If the main post object is actually a post then we need to get the first level comments
      if (post.type === 'posts') {
        filter = {
          postId: post.id,
          parentId: '_none',
        };
        // If however they passed us a comment to be used as the main, then we need to fetch the second level comments
      } else if (post.type === 'comments') {
        filter = {
          parentId: post.id,
        };
      }

      const comments = await Kitsu.findAll('comments', {
        filter,
        fields: {
          users: 'slug,avatar,name',
        },
        include: 'user,uploads,parent,post',
        sort: '-createdAt',
        ...requestOptions,
      });

      const processed = preprocessFeedPosts(comments);
      const uniqueComments = uniqBy(
        [...processed.reverse(), ...this.state.comments],
        'id'
      );

      this.setState({ comments: uniqueComments, isLoadingComments: false });
    } catch (err) {
      this.setState({ isLoadingComments: false });
      console.log('Error fetching comments: ', err);
    }
  };

  fetchLikes = async () => {
    const { currentUser } = this.props;
    const { post } = this.state;

    const isComment = post.type === 'comments';
    const likesEndpoint = isComment ? 'commentLikes' : 'postLikes';
    const idKey = isComment ? 'commentId' : 'postId';

    try {
      const likes = await Kitsu.findAll(likesEndpoint, {
        filter: {
          [idKey]: post.id,
          userId: currentUser.id,
        },
        include: 'user',
        page: {
          limit: 4,
        },
      });

      const like = likes.length && likes[0];

      this.setState({ like });
    } catch (err) {
      console.log('Error fetching likes: ', err);
    }
  };

  focusOnCommentInput = () => {
    this.commentInput.focus();
  };

  goBack = () => {
    Navigation.pop(this.props.componentId);
  };

  keyExtractor = (item) => `${item.id}`;

  navigateToUserProfile = (userId) => {
    if (userId) {
      Navigation.push(this.props.componentId, {
        component: {
          name: Screens.PROFILE_PAGE,
          passProps: { userId },
        },
      });
    }
  };

  renderItem = ({ item }) => {
    const { currentUser, componentId } = this.props;
    const { post } = this.state;

    return (
      <Comment
        post={post}
        comment={item}
        currentUser={currentUser}
        componentId={componentId}
        onAvatarPress={(id) => this.navigateToUserProfile(id)}
        onReplyPress={(user, callback) =>
          this.onReplyPress(item, user, callback)
        }
      />
    );
  };

  renderItemSeperatorComponent = () => <View style={{ height: 17 }} />;

  render() {
    const { currentUser, componentId } = this.props;
    const {
      post,
      comment,
      comments,
      commentsCount,
      topLevelCommentsCount,
      isLiked,
      postLikesCount,
      isPostingComment,
      showLoadMoreComments,
      isLoadingComments,
    } = this.state;

    const { id, updatedAt, content, embed, media, spoiledUnit, uploads } = post;

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: null })}
        style={{
          flex: 1,
          paddingTop: statusBarHeight + (isX ? paddingX : 0),
          backgroundColor: '#FFFFFF',
        }}
      >
        <StatusBar barStyle="dark-content" />

        <PostHeader
          post={post}
          currentUser={currentUser}
          avatar={
            (post.user && post.user.avatar && post.user.avatar.medium) ||
            defaultAvatar
          }
          onAvatarPress={() => {
            if (post.user) this.navigateToUserProfile(post.user.id);
          }}
          name={(post.user && post.user.name) || '-'}
          time={post.createdAt}
          onBackButtonPress={this.goBack}
          onEditPress={this.toggleEditor}
          onDelete={this.deletePost}
        />
        <View style={{ flex: 1 }}>
          <ScrollView>
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
              showViewParent={!!(post && post.post)}
              onStatusPress={this.onViewParentPress}
            />
            <PostActions
              isLiked={isLiked}
              onLikePress={this.toggleLike}
              onCommentPress={this.focusOnCommentInput}
              onSharePress={() => {}}
            />

            <PostCommentsSection>
              {showLoadMoreComments && (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 8,
                    paddingBottom: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={this.onViewAllComment}
                >
                  <Text>View All Comments</Text>
                </TouchableOpacity>
              )}
              {(isLoadingComments ||
                (comments.length === 0 && topLevelCommentsCount > 0)) && (
                <SceneLoader />
              )}
              {comments.length > 0 &&
                topLevelCommentsCount > comments.length &&
                !showLoadMoreComments && (
                  <CommentPagination
                    onPress={this.onPagination}
                    isLoading={this.state.isLoadingNextPage}
                  />
                )}
              {comments.length > 0 && (
                <FlatList
                  listKey={`${post.id}`}
                  data={comments}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
                  ItemSeparatorComponent={this.renderItemSeperatorComponent}
                />
              )}
            </PostCommentsSection>
          </ScrollView>
        </View>

        <PostFooter>
          {this.state.isReplying && (
            <PostReplyBanner
              name={this.replyRef.name}
              onClose={() => {
                this.setState({ isReplying: false });
                this.replyRef = null;
              }}
            />
          )}
          <PostSection>
            <CommentTextInput
              inputRef={(el) => {
                this.commentInput = el;
              }}
              currentUser={currentUser}
              comment={comment}
              onCommentChanged={this.onCommentChanged}
              onGifSelected={this.onGifSelected}
              onSubmit={this.onSubmitComment}
              loading={isPostingComment}
              multiline
            />
          </PostSection>
        </PostFooter>
      </KeyboardAvoidingView>
    );
  }
}
