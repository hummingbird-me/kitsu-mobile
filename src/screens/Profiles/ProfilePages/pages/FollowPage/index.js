import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import URL from 'url-parse';
import { FlatList } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { FollowBox } from 'kitsu/screens/Profiles/components/FollowBox';
import { defaultAvatar } from 'kitsu/constants/app';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { offWhite } from 'kitsu/constants/colors';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

class FollowPage extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  state = {
    userId: null,
    currentUser: null,
    loading: true,
    isLoadingNextPage: false,
    refreshing: false,
    following: [],
  }

  componentDidMount = () => {
    this.fetchPage();
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.fetchPage({ reset: true });
    this.setState({ refreshing: false });
  }

  fetchNextPage = async () => {
    this.setState({ isLoadingNextPage: true });
    await this.fetchPage();
    this.setState({ isLoadingNextPage: false });
  }

  offset = undefined;
  canFetchNext = true;

  fetchPage = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 20;

    if (this.isFetchingPage) return;
    this.isFetchingPage = true;

    if (reset) {
      this.offset = undefined;
      this.canFetchNext = true;
    }

    if (!this.canFetchNext) {
      this.offset = undefined;
      this.isFetchingPage = false;
      return;
    }

    try {
      const userId = this.props.navigation.getParam('userId', undefined);
      const result = await Kitsu.findAll('follows', {
        fields: {
          users: 'avatar,name,slug,followersCount',
        },
        filter: {
          follower: userId,
        },
        include: 'followed',
        sort: '-created_at',
        page: {
          offset: this.offset,
          limit: PAGE_SIZE,
        },
      });
      console.log(userId, result);

      this.canFetchNext = !isEmpty(result && result.links && result.links.next);
      const nextPage = new URL(result.links.next, true);
      this.offset = nextPage.query['page[offset]'];
      const following = reset ? [...result] : [...this.state.following, ...result];

      this.setState({
        following,
        loading: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving following: ', err);

      this.setState({
        following: [],
        error,
        refreshing: false,
      });
    } finally {
      this.isFetchingPage = false;
    }
  }

  keyExtractor = item => `${item.id}-${item.updatedAt}`;

  renderFollowingItem = ({ item }) => {
    if (!item || !item.followed) return null;
    const { avatar, name, id, followersCount } = item.followed;
    return (
      <FollowBox
        avatar={(avatar && avatar.medium) || defaultAvatar}
        onAvatarPress={() => {
          this.props.navigation.navigate('ProfilePages', { userId: id });
        }}
        name={name}
        followersCount={followersCount}
      />
    );
  }

  render() {
    const { following, loading, isLoadingNextPage } = this.state;

    if (loading) {
      return <SceneLoader />;
    }

    return (
      <TabContainer>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={following}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          renderItem={this.renderFollowingItem}
          onEndReached={this.fetchNextPage}
          onEndReachedThreshold={0.6}
          ListFooterComponent={() => isLoadingNextPage && (
            <SceneLoader color={offWhite} />
          )}
          ItemSeparatorComponent={() => <RowSeparator />}
        />
      </TabContainer>
    );
  }
}

export default FollowPage;
