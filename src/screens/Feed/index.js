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
import { FEED_DATA } from './stub';

const TAB_ITEMS = [
  { key: 'following', label: 'Following' },
  { key: 'anime', label: 'Anime' },
  { key: 'manga', label: 'Manga' },
];

class Feed extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    activeFeed: 'following',
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
      {TAB_ITEMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.activeFeed === tabItem.key}
          onPress={() => this.setActiveFeed(tabItem.key)}
        />
      ))}
    </TabBar>
  );

  renderPost = post => (
    <Post
      onPostPress={this.navigateToPost}
      authorAvatar={defaultAvatar}
      authorName="Josh"
      postTime={post.createdAt}
      postContent={post.content}
      postLikesCount={post.postLikesCount}
      postCommentCount={post.commentsCount}
      comments={post.comments}
      onLikePress={this.onActionPress}
      onCommentPress={this.onActionPress}
      onSharePress={this.onActionPress}
    />
  )

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple }}>
        {this.renderFeedFilter()}
        <FlatList
          data={FEED_DATA}
          renderItem={({ item }) => this.renderPost(item)}
          ListHeaderComponent={() => <CreatePostButton avatar={defaultAvatar} onPress={this.navigateToCreatePost} />}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        />
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
