import React, { PureComponent } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  View,
  StatusBar,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import { PropTypes } from 'prop-types';
import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import {
  PostFooter,
  PostSection,
  PostCommentsSection,
  PostReplyBanner,
} from 'kitsu/screens/Feed/components/Post';
import { PostHeader, PostMain, PostActions } from 'kitsu/screens/Feed/components/Post/components';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Comment, CommentPagination } from 'kitsu/screens/Feed/components/Comment';
import { isX, paddingX } from 'kitsu/utils/isX';
import { preprocessFeedPosts, preprocessFeedPost } from 'kitsu/utils/preprocessFeed';
import * as colors from 'kitsu/constants/colors';
import { extractUrls } from 'kitsu/utils/url';
import { isEmpty, uniqBy } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';

export default class PostDetails extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    currentUser: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    postLikesCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    comments: PropTypes.arrayOf(PropTypes.object),
    topLevelCommentsCount: PropTypes.number,
    commentsCount: PropTypes.number,
    like: PropTypes.object,
    isLiked: PropTypes.bool,
    syncComments: PropTypes.func,
    showLoadMoreComments: PropTypes.bool,
  };

  static defaultProps = {
    postLikesCount: 0,
    comments: [],
    topLevelCommentsCount: 0,
    commentsCount: 0,
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

    const { post, postLikesCount, comments, topLevelCommentsCount, commentsCount, like, isLiked } = props;
    const postLikes =
      parseInt(postLikesCount, 10) ||
      parseInt(post.postLikesCount, 10) ||
      parseInt(post.likesCount, 10) || 0;

    this.state = {
      comment: '',
      comments,
      topLevelCommentsCount,
      commentsCount,
      like,
      isLiked,
      postLikesCount: postLikes,
      taggedMedia: {
        media: {
          canonicalTitle: 'Made in Abyss',
        },
        episode: 1,
      },
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
    if (!comments || comments.length === 0) { this.fetchComments(); }
    if (!like) { this.fetchLikes(); }
  }

  onViewAllComment = () => {
    if (this.state.isLoadingComments) return;

    this.setState({ comments: [], showLoadMoreComments: false }, () => {
      this.fetchComments();
    });
  }

  onCommentChanged = comment => this.setState({ comment });

  onGifSelected = (gif) => {
    if (!(gif && gif.id)) return;
    const gifUrl = `https://media.giphy.com/media/${gif.id}/giphy.gif`;
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

    try {
      const { currentUser, post, syncComments } = this.props;

      // Update the embed
      let embedUrl = this.state.embedUrl;

      // If we don't have an embed set then use the first link
      const links = extractUrls(this.state.comment.trim());
      if (isEmpty(embedUrl) && links.length > 0) {
        embedUrl = links[0];
      }

      // Check if this is a reply rather than a top-level comment
      let replyOptions = {};
      if (this.replyRef) {
        replyOptions = {
          parent: {
            id: this.replyRef.comment.id,
            type: 'comments',
          },
          ...replyOptions,
        };
      }

      const comment = await Kitsu.create('comments', {
        content: this.state.comment.trim(),
        embedUrl,
        post: {
          id: post.id,
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

      if (this.replyRef) {
        this.replyRef.callback(comment);
        this.replyRef = null;
      } else {
        const uniqueComments = uniqBy([...this.state.comments, processed], 'id');
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
    this.replyRef = { comment, mention, name, callback };
    this.focusOnCommentInput();
  };

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
      this.setState({
        isLiked: !this.state.isLiked,
        postLikesCount: isLiked ? postLikesCount - 1 : postLikesCount + 1,
      });
    }
  };

  fetchComments = async (requestOptions = {}) => {
    this.setState({ isLoadingComments: true });
    try {
      const { post } = this.props;

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
        include: 'user,uploads',
        sort: '-createdAt',
        ...requestOptions,
      });

      const processed = preprocessFeedPosts(comments);
      const uniqueComments = uniqBy([...processed.reverse(), ...this.state.comments], 'id');

      this.setState({ comments: uniqueComments, isLoadingComments: false });
    } catch (err) {
      this.setState({ isLoadingComments: false });
      console.log('Error fetching comments: ', err);
    }
  };

  fetchLikes = async () => {
    const { currentUser, post } = this.props;
    try {
      const likes = await Kitsu.findAll('postLikes', {
        filter: {
          postId: post.id,
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

  keyExtractor = item => `${item.id}`;

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
    const { currentUser, post, componentId } = this.props;
    return (
      <Comment
        post={post}
        comment={item}
        currentUser={currentUser}
        componentId={componentId}
        onAvatarPress={id => this.navigateToUserProfile(id)}
        onReplyPress={(user, callback) => this.onReplyPress(item, user, callback)}
      />
    );
  };

  renderItemSeperatorComponent = () => <View style={{ height: 17 }} />;

  render() {
    const { currentUser, post, componentId } = this.props;
    const { comment, comments, commentsCount, topLevelCommentsCount, isLiked, postLikesCount,
      isPostingComment, showLoadMoreComments, isLoadingComments } = this.state;

    const { id, updatedAt, content, embed, media, spoiledUnit, uploads } = post;

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: null })}
        style={{ flex: 1, paddingTop: isX ? paddingX + 20 : 20, backgroundColor: '#FFFFFF' }}
      >
        <StatusBar barStyle="dark-content" />

        <PostHeader
          post={post}
          currentUser={currentUser}
          avatar={(post.user && post.user.avatar && post.user.avatar.medium) || defaultAvatar}
          onAvatarPress={() => {
            if (post.user) this.navigateToUserProfile(post.user.id);
          }}
          name={(post.user && post.user.name) || '-'}
          time={post.createdAt}
          onBackButtonPress={this.goBack}
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
            />

            <PostActions
              isLiked={isLiked}
              onLikePress={this.toggleLike}
              onCommentPress={this.focusOnCommentInput}
              onSharePress={() => {}}
            />

            <PostCommentsSection>
              {showLoadMoreComments &&
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
              }
              {(isLoadingComments || (comments.length === 0 && topLevelCommentsCount > 0)) && 
                <SceneLoader />
              }
              {comments.length > 0 && topLevelCommentsCount > comments.length && (
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
