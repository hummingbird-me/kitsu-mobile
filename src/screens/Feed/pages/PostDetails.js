import React, { PureComponent } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  View,
  StatusBar,
  ScrollView,
  Platform,
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
import { isEmpty } from 'lodash';

export default class PostDetails extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const { post, postLikesCount } = props.navigation.state.params;
    const postLikes =
      parseInt(postLikesCount, 10) ||
      parseInt(post.postLikesCount, 10) ||
      parseInt(post.likesCount, 10) || 0;

    this.state = {
      comment: '',
      comments: props.navigation.state.params.comments && [
        ...props.navigation.state.params.comments,
      ],
      topLevelCommentsCount: props.navigation.state.params.topLevelCommentsCount,
      commentsCount: props.navigation.state.params.commentsCount,
      like: props.navigation.state.params.like,
      isLiked: props.navigation.state.params.isLiked,
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
    };
  }

  componentDidMount() {
    const { comments, like } = this.props.navigation.state.params;
    if (!comments || comments.length === 0) { this.fetchComments(); }
    if (!like) { this.fetchLikes(); }
  }

  onCommentChanged = comment => this.setState({ comment });

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
      const { currentUser, post, syncComments } = this.props.navigation.state.params;

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
        comment: '',
        isReplying: false,
        commentsCount: this.state.commentsCount + 1
      });

      if (this.replyRef) {
        this.replyRef.callback(comment);
        this.replyRef = null;
      } else {
        this.setState({
          comments: [...this.state.comments, processed],
          topLevelCommentsCount: this.state.topLevelCommentsCount + 1
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
      const { currentUser, post } = this.props.navigation.state.params;
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
    try {
      const { post } = this.props.navigation.state.params;

      const comments = await Kitsu.findAll('comments', {
        filter: {
          postId: post.id,
          parentId: '_none',
        },
        fields: {
          users: 'slug,avatar,name',
        },
        include: 'user',
        sort: '-createdAt',
        ...requestOptions,
      });

      const processed = preprocessFeedPosts(comments);

      this.setState({ comments: [...processed.reverse(), ...this.state.comments] });
    } catch (err) {
      console.log('Error fetching comments: ', err);
    }
  };

  fetchLikes = async () => {
    const { currentUser, post } = this.props.navigation.state.params;
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
    this.props.navigation.goBack();
  };

  keyExtractor = item => item.id;

  navigateToUserProfile = (userId) => {
    if (userId) this.props.navigation.navigate('ProfilePages', { userId });
  };

  renderItem = ({ item }) => {
    const { currentUser, post } = this.props.navigation.state.params;
    return (
      <Comment
        post={post}
        comment={item}
        currentUser={currentUser}
        navigation={this.props.navigation}
        onAvatarPress={id => this.navigateToUserProfile(id)}
        onReplyPress={(user, callback) => this.onReplyPress(item, user, callback)}
      />
    );
  };

  renderItemSeperatorComponent = () => <View style={{ height: 17 }} />;

  render() {
    // We expect to have navigated here using react-navigation, and it takes all our props
    // and jams them over into this crazy thing.
    const { currentUser, post } = this.props.navigation.state.params;
    const { comment, comments, commentsCount, topLevelCommentsCount, isLiked, postLikesCount,
        isPostingComment } = this.state;

    const { content, embed, media, spoiledUnit } = post;

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
              content={content}
              embed={embed}
              likesCount={postLikesCount}
              commentsCount={commentsCount}
              taggedMedia={media}
              taggedEpisode={spoiledUnit}
              navigation={this.props.navigation}
            />

            <PostActions
              isLiked={isLiked}
              onLikePress={this.toggleLike}
              onCommentPress={this.focusOnCommentInput}
              onSharePress={() => {}}
            />

            <PostCommentsSection>
              {comments.length === 0 && topLevelCommentsCount > 0 && <SceneLoader />}
              {comments.length > 0 && topLevelCommentsCount > comments.length && (
                <CommentPagination
                  onPress={this.onPagination}
                  isLoading={this.state.isLoadingNextPage}
                />
              )}
              {comments.length > 0 && (
                <FlatList
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
