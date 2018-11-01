import React from 'react';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import PropTypes from 'prop-types';
import URL from 'url-parse';
import { Kitsu } from 'kitsu/config/api';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { listBackPurple, offWhite } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Feed/components/TabBar';
import { CreatePostRow } from 'kitsu/screens/Feed/components/CreatePostRow';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { isX, paddingX } from 'kitsu/utils/isX';
import { isEmpty } from 'lodash';
import { FeedCache } from 'kitsu/utils/cache';
import { Navigation } from 'react-native-navigation';
import { Screens, NavigationActions } from 'kitsu/navigation';
import { statusBarHeight } from 'kitsu/constants/app';
import { registerDeepLinks, unregisterDeepLinks } from 'kitsu/utils/deeplink';
import { feedStreams } from './feedStreams';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: listBackPurple,
    paddingTop: statusBarHeight + (isX ? paddingX : 0),
  },
  contentContainer: {
    flex: 1,
    backgroundColor: listBackPurple,
  },
});

class Feed extends React.PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    currentUser: PropTypes.object.isRequired,
  };

  static options() {
    return {
      sideMenu: {
        left: {
          // Enable side drawer only for Feed
          enabled: true,
        },
      },
    };
  }

  state = {
    activeFeed: 'followingFeed',
    refreshing: false,
    isLoadingNextPage: false,
    data: [],
  };

  componentDidMount() {
    registerDeepLinks();
    this.fetchFeed();
  }

  componentWillUnmount() {
    unregisterDeepLinks();
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchFeed({ reset: true });
    this.setState({ refreshing: false });
  };

  onDrawer = () => {
    Navigation.mergeOptions(Screens.SIDEBAR, {
      sideMenu: {
        left: {
          visible: true,
        },
      },
    });
  }

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

  fetchNextPage = async () => {
    this.setState({ isLoadingNextPage: true });
    await this.fetchFeed();
    this.setState({ isLoadingNextPage: false });
  };

  cursor = undefined;
  canFetchNext = true;

  fetchFeed = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 10;

    if (this.isFetchingFeed) return;
    this.isFetchingFeed = true;

    if (reset) {
      FeedCache.clear();
      this.cursor = undefined;
      this.canFetchNext = true;
    }

    if (!this.canFetchNext) {
      this.isFetchingFeed = false;
      return;
    }

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
      } else if (this.state.activeFeed === 'globalFeed') {
        // Global feed
        // /api/edge/feeds/global/global
        subPath = 'global';
      }

      const result = await Kitsu.one(this.state.activeFeed, subPath).get({
        include:
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga,subject.uploads,target.uploads',
        filter: { kind: 'posts' },
        page: {
          cursor: this.cursor,
          limit: PAGE_SIZE,
        },
      });

      // I need to read the cursor value out of the 'next' link in the result.
      this.canFetchNext = !isEmpty(result && result.links && result.links.next);
      const url = new URL(result.links.next, true);
      this.cursor = url.query['page[cursor]'];

      // Discard the activity groups and activities for now, flattening to
      // just the subject of the activity.
      const newPosts = preprocessFeed(result);
      const data = reset ? [...newPosts] : [...this.state.data, ...newPosts];

      this.setState({
        data,
        refreshing: false,
      });
    } catch (error) {
      console.log(`Error while refreshing ${this.state.activeFeed}: `, error);

      this.setState({
        data: [],
        error,
      });
    } finally {
      this.isFetchingFeed = false;
    }
  };

  navigateToPost = (props) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: props,
      },
    });
  }

  navigateToCreatePost = () => {
    if (this.props.currentUser) {
      NavigationActions.showCreatePostModal({
        onPostCreated: () => this.fetchFeed({ reset: true }),
      });
    }
  };

  navigateToUserProfile = (userId) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.PROFILE_PAGE,
        passProps: { userId },
      },
    });
  };

  navigateToMedia = ({ mediaId, mediaType }) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: { mediaId, mediaType },
      },
    });
  };

  keyExtractor = (item, index) => {
    return `${item.id}-${item.updatedAt}`;
  }

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
            componentId={this.props.componentId}
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
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TabBar currentUser={this.props.currentUser} onPress={this.onDrawer}>
          {feedStreams.map(tabItem => (
            <TabBarLink
              key={tabItem.key}
              label={tabItem.label}
              isActive={this.state.activeFeed === tabItem.key}
              onPress={() => this.setActiveFeed(tabItem.key)}
            />
          ))}
        </TabBar>

        <View style={styles.contentContainer}>
          <KeyboardAwareFlatList
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderPost}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            onMomentumScrollBegin={() => {
              // Prevent iOS calling onendreached when list is loaded.
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={() => {
              if (!this.onEndReachedCalledDuringMomentum) {
                this.fetchNextPage();
                this.onEndReachedCalledDuringMomentum = true;
              }
            }}
            onEndReachedThreshold={0.6}
            ListHeaderComponent={<CreatePostRow onPress={this.navigateToCreatePost} />}
            ListFooterComponent={() => this.state.isLoadingNextPage && (
              <SceneLoader color={offWhite} />
            )}

            /*
              Disable this on iOS if we start to get missing content
              We could also improve performance by setting `windowSize` prop (default is 21, 10 views above and 10 views below)
            */
            removeClippedSubviews={Platform.OS === 'android'}
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
