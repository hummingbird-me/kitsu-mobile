import React from 'react';
import { KeyboardAvoidingView, FlatList, View, StatusBar, ScrollView } from 'react-native';
import { defaultAvatar } from 'kitsu/constants/app';
import { PostHeader, PostMain, PostAction, PostFooter, PostSection, PostCommentsSection } from 'kitsu/screens/Feed/components/Post';
import { CommentTextInput } from 'kitsu/screens/Feed/components/CommentTextInput';
import { Comment } from 'kitsu/screens/Feed/components/Comment';
import { FEED_DATA } from '../stub';

class PostDetails extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {};

  componentWillUnmount = () => {
    StatusBar.setBarStyle('light-content');
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  onActionPress = () => {}

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
            <PostAction
              onLikePress={this.onActionPress}
              onCommentPress={this.onActionPress}
              onSharePress={this.onActionPress}
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
            <CommentTextInput />
          </PostSection>
        </PostFooter>
      </KeyboardAvoidingView>
    );
  }
}

export default PostDetails;
