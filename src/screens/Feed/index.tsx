import { isEmpty } from 'lodash';
import React from 'react';
import { FlatList, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { SceneLoader } from '@/components/SceneLoader';
import { Kitsu } from '@/config/api';
import { statusBarHeight } from '@/constants/app';
import { listBackPurple, offWhite } from '@/constants/colors';
import { useAccount } from '@/contexts/AccountContext';
import CreatePostRow from '@/screens/Feed/components/CreatePostRow';
import { Post } from '@/screens/Feed/components/Post';
import { TabBar, TabBarLink } from '@/screens/Feed/components/TabBar';
import { FeedCache } from '@/utils/cache';
import { isX, paddingX } from '@/utils/isX';
import { preprocessFeed } from '@/utils/preprocessFeed';

import { feedStreams } from './feedStreams';

type FeedProps = {
  currentUser: {
    id: string;
  };
};

type FeedState = {
  activeFeed: 'followingFeed' | 'globalFeed';
  refreshing: boolean;
  isLoadingNextPage: boolean;
  data: any[];
  error: unknown;
};

const keyExtractor = (item, index) => {
  return `${item.id}-${item.updatedAt}`;
};

class Feed extends React.PureComponent<FeedProps, FeedState> {
  isFetchingFeed = false;
  onEndReachedCalledDuringMomentum = false;
  state: FeedState = {
    activeFeed: 'followingFeed',
    refreshing: false,
    isLoadingNextPage: false,
    data: [],
    error: null,
  };

  componentDidMount() {
    this.fetchFeed();
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchFeed({ reset: true });
    this.setState({ refreshing: false });
  };

  setActiveFeed = (activeFeed: 'followingFeed' | 'globalFeed') => {
    this.setState(
      {
        activeFeed,
        data: [],
        refreshing: true,
      },
      () => {
        this.fetchFeed({ reset: true });
      }
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

      if (this.state.activeFeed === 'globalFeed') {
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
      const url = new URL(result.links.next);
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
  };

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

  renderPost = ({ item, index }) => {
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
      default:
        console.log(`WARNING: Ignored post type: ${item.type}`);
        return null;
    }
  };

  render() {
    console.log('Render feed');
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TabBar>
          {feedStreams.map((tabItem) => (
            <TabBarLink
              key={tabItem.key}
              label={tabItem.label}
              isActive={this.state.activeFeed === tabItem.key}
              onPress={() => this.setActiveFeed(tabItem.key)}
            />
          ))}
        </TabBar>

        <View style={styles.contentContainer}>
          <FlatList
            renderScrollComponent={(props) => (
              <KeyboardAwareScrollView {...props} />
            )}
            data={this.state.data}
            keyExtractor={keyExtractor}
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
            ListHeaderComponent={
              <CreatePostRow onPress={this.navigateToCreatePost} />
            }
            ListFooterComponent={() =>
              this.state.isLoadingNextPage && <SceneLoader color={offWhite} />
            }
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

export default () => {
  const { profile } = useAccount();
  return <Feed currentUser={profile} />;
};

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
