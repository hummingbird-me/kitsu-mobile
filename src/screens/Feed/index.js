import React from 'react';
import { RefreshControl, StatusBar, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
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
import { feedStreams } from './feedStreams';

const LAYOUT_TYPES = {
  CREATE_POST: 'CREATE_POST',
  POST: 'POST',
};

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
    isLoadingNextPage: false,
    dataProvider: null,
  };

  cursor = undefined;
  canFetchNext = true;

  componentWillMount() {
    // Create a layout for `CreatePost` header component as `RecycleListView`
    // does not currently support rendering a header component. This is planned
    // for the future and if we don't add the component as part of the list it will
    // remain static.
    this.layoutProvider = new LayoutProvider((index) => {
      // Create post component will always be at 0 index.
      if (index === 0) {
        return LAYOUT_TYPES.CREATE_POST;
      }
      return LAYOUT_TYPES.POST;
    }, (type, dim) => {
      switch (type) {
        case LAYOUT_TYPES.CREATE_POST:
          dim.width = Dimensions.get('window').width;
          dim.height = 65;
          break;
        case LAYOUT_TYPES.POST:
          // Acts as a basic layout, we use `forceNonDeterministicRendering` so
          // actual width/height is determined after render of the row
          dim.width = Dimensions.get('window').width;
          dim.height = 400;
          break;
      }
    });

    const dataProvider = new DataProvider((rowA, rowB) => {
      return rowA.id !== rowB.id;
    }).cloneWithRows([0]);
    this.setState({ dataProvider });
  }

  componentDidMount() {
    this.fetchFeed();
  };

  navigateToPost = (props) => {
    this.props.navigation.navigate('PostDetails', props);
  };

  navigateToCreatePost = () => {
    if (this.props.currentUser) {
      this.props.navigation.navigate('CreatePost', {
        onNewPostCreated: () => this.fetchFeed({ reset: true }),
      });
    }
  };

  navigateToUserProfile = (userId) => {
    this.props.navigation.navigate('ProfilePages', { userId });
  };

  navigateToMedia = ({ mediaId, mediaType }) => {
    this.props.navigation.navigate('MediaPages', { mediaId, mediaType });
  };

  fetchFeed = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 10;

    if (this.isFetchingFeed) return;
    this.isFetchingFeed = true;

    if (reset) {
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
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga',
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
      const data = reset ? [0, ...newPosts] : [...this.state.dataProvider.getAllData(), ...newPosts];
      const dataProvider = this.state.dataProvider.cloneWithRows(data);
      this.setState({ dataProvider, refreshing: false });
    } catch (error) {
      console.log(`Error while refreshing ${this.state.activeFeed}: `, error);
      this.setState({
        dataProvider: this.state.dataProvider.cloneWithRows([0]),
        error,
      });
    } finally {
      this.isFetchingFeed = false;
    }
  };

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchFeed({ reset: true });
    this.setState({ refreshing: false });
  };

  fetchNextPage = async () => {
    this.setState({ isLoadingNextPage: true });
    await this.fetchFeed();
    this.setState({ isLoadingNextPage: false });
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

  renderPost = (data) => {
    switch (data.type) {
      case 'posts':
        return (
          <Post
            post={data}
            onPostPress={this.navigateToPost}
            currentUser={this.props.currentUser}
            navigation={this.props.navigation}
          />
        );
      default:
        return null;
    }
  }

  renderRow = (type, data) => {
    switch (type) {
      case LAYOUT_TYPES.CREATE_POST:
        return this.renderHeader();
      case LAYOUT_TYPES.POST:
        return this.renderPost(data);
      default:
        console.log('Attempting to render an invalid row');
        return null;
    }
  }

  renderHeader = () => (
    <CreatePostRow onPress={this.navigateToCreatePost} />
  )

  renderFooter = () => (
    this.state.isLoadingNextPage && (
      <SceneLoader color={offWhite} />
    )
  )

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
          <RecyclerListView
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.dataProvider}
            rowRenderer={this.renderRow}
            onEndReached={this.fetchNextPage}
            renderFooter={this.renderFooter}
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
            forceNonDeterministicRendering
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

/**
 * <KeyboardAwareFlatList
            data={this.state.data}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderPost}
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
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
            }
          />
 */
