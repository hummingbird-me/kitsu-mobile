import React from 'react';
import { PropTypes } from 'prop-types';
import { KeyboardAvoidingView, FlatList, View, StatusBar, ScrollView } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { PostHeader, PostMain, PostActions, PostFooter, PostSection, PostCommentsSection } from 'kitsu/screens/Feed/components/Post';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { FEED_DATA } from '../stub';

class PostDetails extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    isLiked: false,
  };

  componentWillUnmount = () => {
    StatusBar.setBarStyle('light-content');
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

  render() {
    const post = FEED_DATA[0];
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, paddingTop: 20, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="dark-content" />

        <PostHeader
          avatar={defaultAvatar}
          name="Josh"
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
                data={post.comments}
                renderItem={({ item }) => <Comment comment={item} />}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            </PostCommentsSection>
          </ScrollView>
        </View>

        <PostFooter>
          <PostSection>
            <CommentTextInput inputRef={(el) => { this.commentInput = el; }} />
          </PostSection>
        </PostFooter>
      </KeyboardAvoidingView>
    );
  }
}

PostDetails.propTypes = {
  navigation: PropTypes.object,
};

PostDetails.defaultProps = {
  navigation: {},
};

export default PostDetails;
