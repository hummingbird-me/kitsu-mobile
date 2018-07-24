import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import URL from 'url-parse';
import { FlatList, View, Dimensions, TouchableOpacity } from 'react-native';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { FollowBox } from 'kitsu/screens/Profiles/components/FollowBox';
import { defaultAvatar } from 'kitsu/constants/app';
import { ScrollableTabBar } from 'kitsu/components/ScrollableTabBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { RowSeparator } from 'kitsu/screens/Profiles/components/RowSeparator';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { offWhite, listBackPurple } from 'kitsu/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyledText } from 'kitsu/components/StyledText';
import { isEmpty } from 'lodash';
import { Kitsu } from 'kitsu/config/api';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const renderScrollTabBar = () => <ScrollableTabBar />;
const TAB_LISTS = ['Following', 'Followers'];

class FollowPage extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  static navigationOptions = ({ navigation }) => ({
    header: <CustomHeader
      backgroundColor={listBackPurple}
      leftButtonAction={() => navigation.goBack()}
      leftButtonTitle="Back"
    />,
  });

  state = {
    userId: null,
    currentUser: null,
    isLoadingNextPage: false,
    refreshing: false,
    following: [],
    followers: [],
  }

  componentWillMount() {
    this.activeTab = this.props.navigation.getParam('label', undefined);
  }

  componentDidUpdate() {
    this.scrollableTabView.goToPage(TAB_LISTS.indexOf(this.activeTab), 300);
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

  offsetFollowing = undefined;
  offsetFollowers = undefined;
  canFetchNextFollowing = true;
  canFetchNextFollowers = true;

  fetchPage = async ({ reset = false } = {}) => {
    const PAGE_SIZE = 20;

    if (this.isFetchingPage) return;
    this.isFetchingPage = true;

    switch (this.activeTab) {
      case 'Following':
        if (reset) {
          this.offsetFollowing = undefined;
          this.canFetchNextFollowing = true;
        }

        if (!this.canFetchNextFollowing) {
          this.offsetFollowing = undefined;
          this.isFetchingPage = false;
          return;
        }
        break;
      case 'Followers':
        if (reset) {
          this.offsetFollowers = undefined;
          this.canFetchNextFollowers = true;
        }

        if (!this.canFetchNextFollowers) {
          this.offsetFollowers = undefined;
          this.isFetchingPage = false;
          return;
        }
        break;
      default:
    }

    try {
      const userId = this.props.navigation.getParam('userId', undefined);
      let result = [];
      let oldList = [];
      if (this.activeTab === 'Following') {
        result = await Kitsu.findAll('follows', {
          fields: {
            users: 'avatar,name,slug,followersCount',
          },
          filter: {
            follower: userId,
          },
          include: 'followed',
          sort: '-created_at',
          page: {
            offset: this.offsetFollowing,
            limit: PAGE_SIZE,
          },
        });

        this.canFetchNextFollowing = !isEmpty(result && result.links && result.links.next);
        oldList = this.state.following;
        const nextPage = new URL(result.links.next, true);
        this.offsetFollowing = nextPage.query['page[offset]'];
      } else {
        result = await Kitsu.findAll('follows', {
          fields: {
            users: 'avatar,name,slug,followersCount',
          },
          filter: {
            followed: userId,
          },
          include: 'follower',
          sort: '-created_at',
          page: {
            offset: this.offsetFollowers,
            limit: PAGE_SIZE,
          },
        });

        this.canFetchNextFollowers = !isEmpty(result && result.links && result.links.next);
        oldList = this.state.followers;
        const nextPage = new URL(result.links.next, true);
        this.offsetFollowers = nextPage.query['page[offset]'];
      }

      const newList = reset ? [...result] : [...oldList, ...result];

      if (this.activeTab === 'Following') {
        this.setState({ following: newList });
      } else {
        this.setState({ followers: newList });
      }
    } catch (err) {
      console.log('Unhandled error while retrieving following: ', err);

      if (this.activeTab === 'Following') {
        this.setState({ following: [] });
      } else {
        this.setState({ followers: [] });
      }

      this.setState({
        error,
        refreshing: false,
      });
    } finally {
      this.isFetchingPage = false;
    }
  }

  keyExtractor = item => `${item.id}-${item.updatedAt}`;

  renderFollowingItem = ({ item }) => {
    if (!item ||
      (this.activeTab === 'Following' && !item.followed) ||
      (this.activeTab === 'Followers' && !item.follower)) {
      return null;
    }

    const { avatar, name, id, followersCount } = this.activeTab === 'Following' ? item.followed : item.follower;
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

  renderLists = () => {
    const {
      isLoadingNextPage,
      following,
      followers,
    } = this.state;
    if ((this.activeTab === 'Following' && isEmpty(following)) ||
      (this.activeTab === 'Followers' && isEmpty(followers))) {
      this.fetchPage();
    }

    // if ((label === 'Following' && loadingFollowing) || (label === 'Followers' && loadingFollower)) {
    //   return (<SceneLoader />);
    // }

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.activeTab === 'Following' ? following : followers}
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
        renderItem={this.renderFollowingItem}
        onEndReached={() => this.fetchNextPage()}
        onEndReachedThreshold={0.6}
        ListFooterComponent={() => isLoadingNextPage && (
          <SceneLoader color={offWhite} />
        )}
        ItemSeparatorComponent={() => <RowSeparator />}
      />
    );
  };

  renderSearchBox() {
    return (
      <TouchableOpacity style={styles.searchBox} onPress={this.navigateToSearch}>
        <Icon
          name="search"
          style={styles.searchIcon}
        />
        <StyledText color="dark" textStyle={styles.searchText}>Search Library</StyledText>
      </TouchableOpacity>
    );
  }

  render() {
    const followingCount = this.props.navigation.getParam('followingCount', undefined);
    const followersCount = this.props.navigation.getParam('followersCount', undefined);
    const label = this.props.navigation.getParam('label', undefined);

    return (
      <View style={styles.container}>
        <ScrollableTabView
          locked
          style={{ width: SCREEN_WIDTH }}
          initialPage={TAB_LISTS.indexOf(label)}
          ref={(ref) => { this.scrollableTabView = ref; }}
          renderTabBar={renderScrollTabBar}
          onChangeTab={({ i }) => { this.activeTab = TAB_LISTS[i]; }}
        >
          <View
            key="Following"
            tabLabel={`Following${followingCount === undefined ? '' : ` · ${followingCount}`}`}
            id="following"
          >
            {/* {this.renderSearchBox()} */}
            {this.renderLists()}
          </View>
          <View
            key="Followers"
            tabLabel={`Followers${followersCount === undefined ? '' : ` · ${followersCount}`}`}
            id="followers"
          >
            {/* {this.renderSearchBox()} */}
            {this.renderLists()}
          </View>
        </ScrollableTabView>
      </View>
    );
  }
}

export default FollowPage;
