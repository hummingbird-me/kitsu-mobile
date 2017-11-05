import React, { PureComponent } from 'react';
import { KeyboardAvoidingView, FlatList, View, StatusBar, ScrollView } from 'react-native';
import { PropTypes } from 'prop-types';

import { Kitsu } from 'kitsu/config/api';
import { defaultAvatar } from 'kitsu/constants/app';
import { PostHeader, PostMain, PostActions, PostFooter, PostSection, PostCommentsSection } from 'kitsu/screens/Feed/components/Post';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Comment } from 'kitsu/screens/Feed/components/Comment';

export default class PostDetails extends PureComponent {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      comment: '',
      comments: [...props.navigation.state.params.comments],
      like: props.navigation.state.params.like,
      taggedMedia: {
        media: {
          canonicalTitle: 'Made in Abyss',
        },
        episode: 1,
      },
    };
  }

  onCommentChanged = comment => this.setState({ comment })

  onSubmitComment = async () => {
    try {
      const { currentUser, post } = this.props.navigation.state.params;

      await Kitsu.create('comments', {
        content: this.state.comment,
        post: {
          id: post.id,
          type: 'posts',
        },
        user: {
          id: currentUser.id,
          type: 'users',
        },
      });

      this.setState({ comment: '' });
      this.fetchComments();
    } catch (err) {
      console.log('Error fetching comments: ', err);
    }
  }

  toggleLike = async () => {
    const { currentUser, post } = this.props.navigation.state.params;
    let { like } = this.state;

    if (like) {
      this.setState({ like: null });

      await Kitsu.destroy('postLikes', like.id);
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
  }

  fetchComments = async () => {
    try {
      const { post } = this.props.navigation.state.params;

      const comments = await Kitsu.findAll('comments', {
        filter: {
          postId: post.id,
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

  goBack = () => {
    this.props.navigation.goBack();
  }

  keyExtractor = (item, index) => index

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  }

  renderItem = ({ item }) => (
    <Comment
      comment={item}
      onAvatarPress={() => this.navigateToUserProfile(item.user.id)}
      onReplyPress={this.focusOnCommentInput}
    />
  )

  renderItemSeperatorComponent = () => <View style={{ height: 17 }} />

  render() {
    // We expect to have navigated here using react-navigation, and it takes all our props
    // and jams them over into this crazy thing.
    const { currentUser, post } = this.props.navigation.state.params;
    const { comment, comments, like, taggedMedia } = this.state;

    const {
      content,
      images,
      postLikesCount,
      commentsCount,
      media,
      spoiledUnit,
    } = post;

    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, paddingTop: 20, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="dark-content" />

        <PostHeader
          avatar={(post.user.avatar && post.user.avatar.medium) || defaultAvatar}
          onAvatarPress={() => this.navigateToUserProfile(post.user.id)}
          name={post.user.name}
          time={post.createdAt}
          onBackButtonPress={this.goBack}
        />

        <View style={{ flex: 1 }}>
          <ScrollView>
            <PostMain
              content={content}
              images={images}
              likesCount={postLikesCount}
              commentsCount={commentsCount}
              taggedMedia={media}
              taggedEpisode={spoiledUnit}
              navigation={navigation}
            />

            <PostActions
              isLiked={!!like}
              onLikePress={this.toggleLike}
              onCommentPress={this.focusOnCommentInput}
              onSharePress={() => {}}
            />

            <PostCommentsSection>
              {!comments && <SceneLoader />}
              {comments && (
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
          <PostSection>
            <CommentTextInput
              inputRef={(el) => { this.commentInput = el; }}
              currentUser={currentUser}
              comment={comment}
              onCommentChanged={this.onCommentChanged}
              onSubmit={this.onSubmitComment}
            />
          </PostSection>
        </PostFooter>
      </KeyboardAvoidingView>
    );
  }
}
