import React from 'react';
import { RefreshControl, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import URL from 'url-parse';

import { Kitsu } from 'kitsu/config/api';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { isX, paddingX } from 'kitsu/utils/isX';
import { feedStreams } from './feedStreams';

class Feed extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  state = {
    activeFeed: 'followingFeed',
    refreshing: false,
    data: [],
  };

  componentDidMount = () => {
    this.fetchFeed();
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchFeed({ reset: true });
    this.setState({ refreshing: false });
  };

  setActiveFeed = (activeFeed) => {
    this.setState(
      {
        activeFeed,
        data: [],
        refreshing: true,
      },
      () => {
        this.fetchFeed({ reset: true });
      },
    );
  };

  cursor = undefined;

  fetchFeed = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 10;

    if (reset) this.cursor = undefined;

    try {
      // Following Feed example URL:
      // /api/edge/feeds/timeline/160571
      let subPath = this.props.currentUser.id;

      if (this.state.activeFeed === 'animeFeed') {
        // Anime Feed Example URL:
        // /api/edge/feeds/interest_timeline/160571-Anime
        subPath += '-Anime';
      } else if (this.state.activeFeed === 'mangaFeed') {
        // Manga Feed Example URL:
        // /api/edge/feeds/interest_timeline/160571-Manga
        subPath += '-Manga';
      }

      const result = await Kitsu.one(this.state.activeFeed, subPath).get({
        include:
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
        filter: { kind: 'posts' },
        page: {
          cursor: this.cursor,
          limit: PAGE_SIZE,
        },
      });

      // I need to read the cursor value out of the 'next' link in the result.
      const url = new URL(result.links.next, true);
      this.cursor = url.query['page[cursor]'];

      // Discard the activity groups and activities for now, flattening to
      // just the subject of the activity.
      const newPosts = preprocessFeed(result);
      const data = reset ? [...newPosts] : [...this.state.data, ...newPosts];

      this.setState({ data });
    } catch (error) {
      console.log('Error while refreshing following feed: ', error);

      this.setState({
        data: [],
        error,
      });
    }
  };

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  };

  navigateToCreatePost = () => {
    this.props.navigation.navigate('CreatePost', {
      onNewPostCreated: () => this.fetchFeed({ reset: true }),
    });
  };

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  };

  navigateToMedia = ({ mediaId, mediaType }) => {
    this.props.navigation.navigate('MediaPages', { mediaId, mediaType });
  };

  keyExtractor = (item, index) => index;

  renderPost = ({ item }) => {
    // This dispatches based on the type of an entity to the correct
    // component. If it's not in here it'll just ignore the feed item.
    switch (item.type) {
      case 'posts':
        return (
          <Post
            post={item}
            onPostPress={this.navigateToPost}
            currentUser={this.props.currentUser}
            navigateToUserProfile={userId => this.navigateToUserProfile(userId)}
            navigation={this.props.navigation}
          />
        );
      case 'comments':
        // We explicitly don't render these at the moment.
        return null;
      default:
        console.log(`WARNING: Ignored post type: ${item.type}`);
        return null;
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: listBackPurple, paddingTop: isX ? paddingX : 0 }}>
        <StatusBar barStyle="light-content" />
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

        <View style={{ flex: 1 }}>
          <KeyboardAwareFlatList
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderPost}
            onEndReached={this.fetchFeed}
            onEndReachedThreshold={0.6}
            ListHeaderComponent={<CreatePostRow onPress={this.navigateToCreatePost} />}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(Feed);
