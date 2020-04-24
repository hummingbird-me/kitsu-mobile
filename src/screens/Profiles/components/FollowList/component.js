import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View, ActivityIndicator } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { FollowBox } from 'kitsu/screens/Profiles/components/FollowBox';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { offWhite } from 'kitsu/constants/colors';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';

export class FollowList extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    listType: PropTypes.string.isRequired,
    goToInitialTab: PropTypes.func.isRequired,
    onReloadingUserData: PropTypes.func.isRequired,
    onUpdateFollow: PropTypes.func.isRequired,
  }

  state = {
    isLoadingNextPage: false,
    refreshing: false,
    currentUserFollowings: [],
    followList: [],
    loadingFirstBatch: false,
  }

  componentDidUpdate = () => {
    this.props.goToInitialTab();
  }

  onHandleFollow = async ({ followItem = undefined, isFollowing = undefined } = {}) => {
    if (isFollowing) {
      this.setState(prevState => ({
        currentUserFollowings: [...prevState.currentUserFollowings, followItem],
      }));
    } else {
      this.setState(prevState => ({
        currentUserFollowings: prevState.currentUserFollowings.filter(
          x => x !== followItem,
        ),
      }));
    }

    if (this.props.userId === this.props.currentUser.id) {
      this.props.onUpdateFollow(isFollowing);
      await this.props.onReloadingUserData(this.props.userId);
    }
  }

  onRefresh = async ({ follow = undefined } = {}) => {
    if (this.state.refreshing) return;

    this.setState({ refreshing: true, loadingFirstBatch: true });
    await this.fetchPage({ reset: true });
    if (this.props.userId === this.props.currentUser.id) {
      this.props.onUpdateFollow(follow);
      await this.props.onReloadingUserData(this.props.userId);
    }
    this.setState({ refreshing: false });
  }

  fetchNextPage = async () => {
    if (this.isFetchingPage) return;

    this.setState({ isLoadingNextPage: true });
    await this.fetchPage();
    this.setState({ isLoadingNextPage: false });
  }

  fetchCurrentUserFollow = async ({ followList = [], reset = false } = {}) => {

    try {
      const { currentUser } = this.props;
      const followIds = followList.filter(
        x => x.followed || x.follower,
      ).map((x) => {
        if (x.followed) return x.followed.id;

        return x.follower.id;
      });

      const result = await Kitsu.findAll('follows', {
        filter: {
          follower: currentUser.id,
          followed: followIds,
        },
        fields: {
          users: 'id',
        },
        include: 'followed',
      });

      this.setState(prevState => ({
        currentUserFollowings: reset ? result : [...prevState.currentUserFollowings, ...result],
      }));
    } catch (err) {
      console.log('Error fetching current user following: ', err);
    } finally {
      this.setState({ loadingFirstBatch: false });
    }
  }

  canFetchNext = true;

  fetchPage = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 20;

    if (this.isFetchingPage) return;
    this.isFetchingPage = true;

    if (reset) {
      this.canFetchNext = true;
    }

    if (!this.canFetchNext) {
      this.isFetchingPage = false;
      return;
    }

    let result = [];
    try {
      let filter = {};
      let include = null;
      const userId = this.props.userId;

      if (this.props.listType === 'Following') {
        filter = { follower: userId };
        include = 'followed';
      } else {
        filter = { followed: userId };
        include = 'follower';
      }

      result = await Kitsu.findAll('follows', {
        fields: {
          users: 'avatar,name,slug,followersCount',
        },
        filter,
        include,
        sort: '-created_at',
        page: {
          offset: reset ? 0 : this.state.followList.length,
          limit: PAGE_SIZE,
        },
      });

      this.canFetchNext = !isEmpty(result && result.links && result.links.next);
      this.setState(prevState => ({
        followList: reset ? result : [...prevState.followList, ...result],
      }));
    } catch (err) {
      console.log('Unhandled error while retrieving following: ', err);

      this.setState({
        error,
        refreshing: false,
      });
    } finally {
      await this.fetchCurrentUserFollow({ followList: result, reset });
      this.isFetchingPage = false;
    }
  }

  keyExtractor = item => `${item.id}-${item.updatedAt}`;

  renderFollowingItem = ({ item }) => {
    if (!item || (!item.followed && !item.follower)
      || (item.followed && item.follower)) {
      return null;
    }

    const { currentUser } = this.props;
    const user = item.followed ? item.followed : item.follower;

    return (
      <FollowBox
        onAvatarPress={() => {
          this.props.navigation.navigate('ProfilePages', { userId: user.id });
        }}
        user={user}
        currentUserId={currentUser.id}
        currentUserFollowings={this.state.currentUserFollowings}
        onHandleFollow={this.onHandleFollow}
      />
    );
  }

  render() {
    const { isLoadingNextPage, followList, refreshing, loadingFirstBatch } = this.state;
    if (isEmpty(followList)) {
      this.setState({ loadingFirstBatch: true });
      this.fetchPage();
    }

    if (loadingFirstBatch) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color="white" size="large" />
        </View>
      );
    }

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={followList}
        refreshing={refreshing}
        onRefresh={this.onRefresh}
        renderItem={this.renderFollowingItem}
        onEndReached={() => this.fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => isLoadingNextPage && (
          <SceneLoader color={offWhite} />
        )}
        ItemSeparatorComponent={() => <RowSeparator />}
      />
    );
  }
}
