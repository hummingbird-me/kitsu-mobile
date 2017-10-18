import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserFeed } from 'kitsu/actions';
import { defaultAvatar } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { FEED_DATA, FEED_STREAMS } from './stub';

class Feed extends React.PureComponent {
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

  onActionPress = () => {}

  setActiveFeed = (feed) => {
    this.setState({ activeFeed: feed });
  }

  navigateToPost = () => {
    this.props.navigation.navigate('PostDetails');
  }

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost');
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

  renderPost = item => (
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
    />
  )

  renderCreatePostRow = () => (
    <CreatePostRow
      avatar={defaultAvatar}
      onPress={this.navigateToCreatePost}
    />
  )

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple }}>
        {this.renderFeedFilter()}
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
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
