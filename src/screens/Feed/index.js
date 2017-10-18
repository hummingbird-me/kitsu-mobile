import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { View, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { fetchUserFeed } from 'kitsu/actions';
import { defaultAvatar } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostButton } from 'kitsu/screens/Feed/components/CreatePostButton';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { FEED_DATA } from './stub';
import { feedStreams } from './feedStreams';

class Feed extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

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

  renderFeedFilter = () => (
    <TabBar>
      {feedStreams.map(tabItem => (
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
      key={index}
      onPostPress={this.navigateToPost}
      authorAvatar={defaultAvatar}
      authorName="Josh"
      postTime={item.createdAt}
      postContent={item.content}
      postLikesCount={item.postLikesCount}
      postCommentCount={item.commentsCount}
      comments={item.comments}
      onLikePress={null}
      onSharePress={null}
      onCommentPress={null}
    />
  )

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple }}>
        {this.renderFeedFilter()}
        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            ref={(el) => { this.postList = el; }}
            data={FEED_DATA}
            renderItem={this.renderPost}
            ListHeaderComponent={
              <CreatePostButton
                avatar={defaultAvatar}
                onPress={this.navigateToCreatePost}
              />
            }
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

export default connect(() => ({}), { fetchUserFeed })(Feed);
