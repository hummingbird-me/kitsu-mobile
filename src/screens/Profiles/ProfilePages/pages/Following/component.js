import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import URL from 'url-parse';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { getImgixCoverImage } from 'kitsu/utils/imgix';
import { defaultCover, defaultAvatar } from 'kitsu/constants/app';
import { offWhite } from 'kitsu/constants/colors';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

class Following extends PureComponent {
  static propTypes = {
    userId: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  state = {
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
      const result = await Kitsu.findAll('follows', {
        fields: {
          users: 'avatar,coverImage,name,slug',
        },
        filter: {
          follower: this.props.userId,
        },
        include: 'followed',
        sort: '-created_at',
        page: {
          offset: this.offset,
          limit: PAGE_SIZE,
        },
      });
      console.log(result);

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
    const { avatar, coverImage, name, id } = item.followed;
    return (
      <View style={styles.userContainer}>
        <ProgressiveImage
          hasOverlay
          style={styles.headerCoverImage}
          source={{ uri: (coverImage && getImgixCoverImage(coverImage)) || defaultCover }}
        />
        <View style={styles.userProfileContainer}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('ProfilePages', { userId: id });
          }}
          >
            <FastImage
              style={styles.userProfileImage}
              source={{ uri: (avatar && avatar.medium) || defaultAvatar }}
              cache="web"
            />
          </TouchableOpacity>
          <View style={styles.userProfileTextWrapper}>
            <Text style={styles.userProfileName}>{name}</Text>
          </View>
        </View>
      </View>
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
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          onEndReached={() => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.fetchNextPage();
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          onEndReachedThreshold={0.6}
          ListFooterComponent={() => isLoadingNextPage && (
            <SceneLoader color={offWhite} />
          )}

          removeClippedSubviews
        />
      </TabContainer>
    );
  }
}

export const component = Following;
