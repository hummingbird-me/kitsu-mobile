import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { FollowBox } from 'kitsu/screens/Profiles/components/FollowBox';
import { defaultAvatar } from 'kitsu/constants/app';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { offWhite } from 'kitsu/constants/colors';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';

export class FollowList extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    listType: PropTypes.string.isRequired,
    goToInitialTab: PropTypes.func.isRequired,
  }

  state = {
    isLoadingNextPage: false,
    refreshing: false,
    currentUserFollowings: [],
    followList: [],
  }

  componentWillMount = () => {
    this.fetchCurrentUserFollow();
  }

  componentDidUpdate = () => {
    this.props.goToInitialTab();
  }

  onRefresh = async () => {
    if (this.state.refreshing) return;

    this.setState({ refreshing: true });
    await this.fetchPage({ reset: true });
    this.setState({ refreshing: false });
  }

  fetchNextPage = async () => {
    if (this.isFetchingPage) return;

    this.setState({ isLoadingNextPage: true });
    await this.fetchPage();
    this.setState({ isLoadingNextPage: false });
  }

  fetchCurrentUserFollow = async () => {
    try {
      const { currentUser } = this.props;
      const results = await Kitsu.findAll('follows', {
        filter: {
          follower: currentUser.id,
        },
        fields: {
          users: 'id',
        },
        include: 'followed',
      });
      const currentUserFollowings = Array.from(results, x => x.followed);

      this.setState({ currentUserFollowings });
    } catch (err) {
      console.log('Error fetching current user following: ', err);
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

    try {
      let filter = {};
      let include = null;
      const userId = this.props.currentUser.id;

      if (this.props.listType === 'Following') {
        filter = { follower: userId };
        include = 'followed';
      } else {
        filter = { followed: userId };
        include = 'follower';
      }

      const result = await Kitsu.findAll('follows', {
        fields: {
          users: 'avatar,name,slug,followersCount',
        },
        filter,
        include,
        sort: '-created_at',
        page: {
          offset: this.state.followList.length,
          limit: PAGE_SIZE,
        },
      });

      this.canFetchNext = !isEmpty(result && result.links && result.links.next);
      this.setState(prevState => ({
        followList: [...prevState.followList, ...result],
      }));
    } catch (err) {
      console.log('Unhandled error while retrieving following: ', err);

      this.setState({
        followList: [],
        error,
        refreshing: false,
      });
    } finally {
      this.isFetchingPage = false;
    }
  }

  keyExtractor = item => `${item.id}-${item.updatedAt}`;

  renderFollowingItem = ({ item }) => {
    if (!item || (!item.followed && !item.follower)
      || (item.followed && item.follower)) {
      return null;
    }

    const { avatar, name, id, followersCount } = item.followed ? item.followed : item.follower;
    const { currentUser } = this.props;

    return (
      <FollowBox
        avatar={(avatar && avatar.medium) || defaultAvatar}
        onAvatarPress={() => {
          this.props.navigation.navigate('ProfilePages', { userId: id });
        }}
        name={name}
        followersCount={followersCount}
        userId={id}
        followId={item.id}
        currentUserId={currentUser.id}
        currentUserFollowings={this.state.currentUserFollowings}
      />
    );
  }

  render() {
    const { isLoadingNextPage, followList, refreshing } = this.state;
    if (isEmpty(followList)) this.fetchPage();

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
