import React from 'react';
import { KeyboardAvoidingView, FlatList, View, StatusBar, ScrollView } from 'react-native';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import { defaultAvatar } from 'kitsu/constants/app';
import { PostHeader, PostMain, PostActions, PostFooter, PostSection, PostCommentsSection } from 'kitsu/screens/Feed/components/Post';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { Comment } from 'kitsu/screens/Feed/components/Comment';

class PostDetails extends React.Component {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  state = {
    isLiked: false,
    comment: '',
  };

  onCommmentChanged = comment => this.setState({ comment });
  onSubmitComment = async () => {

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

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  }


  render() {
    // We expect to have navigated here using react-navigation, and it takes all our props
    // and jams them over into this crazy thing.
    const { currentUser, post, comments } = this.props.navigation.state.params;
    const { comment } = this.state;

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
              content={post.content}
              likesCount={post.postLikesCount}
              commentsCount={post.commentsCount}
            />

            <PostActions
              isLiked={this.state.isLiked}
              onLikePress={this.toggleLike}
              onCommentPress={this.focusOnCommentInput}
              onSharePress={() => {}}
            />

            <PostCommentsSection>
              <FlatList
                data={comments}
                renderItem={({ item }) => (
                  <Comment
                    comment={item}
                    onPress={() => this.navigateToUserProfile(item.user.id)}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            </PostCommentsSection>
          </ScrollView>
        </View>

        <PostFooter>
          <PostSection>
            <CommentTextInput
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

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(PostDetails);
