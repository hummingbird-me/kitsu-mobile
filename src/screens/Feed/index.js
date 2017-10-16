import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserFeed } from 'kitsu/actions';
import { defaultAvatar } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostButton } from 'kitsu/screens/Feed/components/CreatePostButton';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { FEED_DATA, FEED_STREAMS } from './stub';

const POST_COMMENT_OFFSET = 260 - (60 - 20); // Keyboard height - Tab Bar height - Space between posts and create post row

class Feed extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    activeFeed: 'follower',
    refreshing: false,
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
  }

  onActionPress = (index) => {
    this.postList.scrollToIndex({ animated: true, index, viewPosition: 1 });
  }

  setActiveFeed = (feed) => {
    this.setState({ activeFeed: feed });
  }

  getItemLayout = (data, index) => (
    {
      length: this.state.itemHeight,
      offset: (this.state.itemHeight + 10) * index,
      index,
    }
  )

  navigateToPost = () => {
    this.props.navigation.navigate('PostDetails');
  }

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
  }

  scrollToCommentInput = (index) => {
    this.postList.scrollToIndex({
      animated: true,
      index,
      viewPosition: 1,
      viewOffset: POST_COMMENT_OFFSET * -1,
    });
  }

  renderFeedFilter = () => (
    <TabBar>
      {FEED_STREAMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.activeFeed === tabItem.key}
          onPress={() => this.setActiveFeed(tabItem.key)}
        />
      ))}
    </TabBar>
  )

  renderPost = ({ item, index }) => (
    <Post
      onPostPress={this.navigateToPost}
      authorAvatar={defaultAvatar}
      authorName="Josh"
      postTime={item.createdAt}
      postContent={item.content}
      postLikesCount={item.postLikesCount}
      postCommentCount={item.commentsCount}
      comments={item.comments}
      onLikePress={this.onActionPress}
      onSharePress={this.onActionPress}
      onCommentPress={this.onActionPress}
      onCommentInputFocus={() => this.scrollToCommentInput(index)}
    />
  )

  renderCreatePostRow = () => (
    <CreatePostButton
      avatar={defaultAvatar}
      onPress={this.navigateToCreatePost}
    />
  )

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple }}>
        {this.renderFeedFilter()}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={(el) => { this.postList = el; }}
            data={FEED_DATA}
            keyboardDismissMode="on-drag"
            renderItem={this.renderPost}
            ListHeaderComponent={() => this.renderCreatePostRow()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
          />
        </View>
      </View>
    );
  }
}

Feed.propTypes = {
  navigation: PropTypes.object,
};

Feed.defaultProps = {
  navigation: {},
};

export default connect(() => ({}), { fetchUserFeed })(Feed);
