import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, Share, View } from 'react-native';
import { connect } from 'react-redux';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Kitsu } from 'kitsu/config/api';
import { defaultCover, statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { EditModal } from 'kitsu/screens/Profiles/components/EditModal';
import { coverImageHeight, scene } from 'kitsu/screens/Profiles/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import { isIdForCurrentUser } from 'kitsu/utils/id';
import { fetchCurrentUser } from 'kitsu/store/user/actions';
import { getImgixCoverImage } from 'kitsu/utils/imgix';
import { parseURL } from 'kitsu/utils/url';
import { isEmpty, isNull } from 'lodash';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';
import { kitsuConfig } from 'kitsu/config/env';
import { Navigation } from 'react-native-navigation';
import { NavigationActions } from 'kitsu/navigation';
import { fetchUserLibrary } from 'kitsu/store/profile/actions';
import { Summary, Feed, About, Library, Groups, Reactions } from './pages';

const HEADER_HEIGHT = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);

const tabPage = (name, Component) => ({ key: name.toLowerCase(), label: name, screen: Component });

const TAB_ITEMS = [
  tabPage('Summary', Summary),
  tabPage('Feed', Feed),
  tabPage('About', About),
  tabPage('Library', Library),
  tabPage('Groups', Groups),
  tabPage('Reactions', Reactions),
];

const tabs = TAB_ITEMS.map(t => t.key);

class ProfilePage extends PureComponent {
  static propTypes = {
    componentId: PropTypes.any.isRequired,
    userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    currentUser: PropTypes.object.isRequired,
    activeTab: PropTypes.oneOf(tabs),
  }

  static defaultProps = {
    activeTab: 'summary',
  }

  constructor(props) {
    super(props);

    let activeTab = props.activeTab;

    // If tab is invalid then show the summary
    if (!tabs.includes(activeTab)) activeTab = 'summary';

    this.state = {
      active: activeTab,
      loading: true,
      error: null,
      profile: null,
      feed: null,
      follow: null,
      isLoadingFollow: false,
      editModalVisible: false,
      libraryActivity: [],
      loadingLibraryActivity: false,
      reactions: [],
      loadingReactions: false,
      groups: [],
      loadingGroups: false,
      stats: [],
      loadingStats: false,
    };
  }

  componentWillMount() {
    const { userId } = this.props;

    if (!userId) {
      this.setState({
        loading: false,
        error: 'Missing userId in component.',
      });
      return;
    }

    this.loadUserData(userId);
    this.fetchFollow(userId);
    this.props.fetchUserLibrary({ userId });
    this.fetchLibraryActivity();
    this.fetchReactions();
    this.fetchGroups();
    this.fetchStats();
  }

  componentWillUnmount() {
    this.setState({ editModalVisible: false });
  }

  onMoreButtonOptionsSelected = async (button) => {
    const { currentUser, userId } = this.props;
    const { profile } = this.state;

    switch (button) {
      case 'Block': {
        await Kitsu.create('blocks', {
          blocked: { id: userId },
          user: { id: currentUser.id },
        });
        break;
      }
      case 'share': {
        const id = (profile && profile.slug) || userId;
        if (isNull(id)) return;
        const url = `${kitsuConfig.kitsuUrl}/users/${id}`;
        const key = Platform.select({ ios: 'url', android: 'message' });
        Share.share({ [key]: url });
        break;
      }
      case 'cover': {
        if (!profile || !profile.coverImage) return;
        const coverURL = profile.coverImage.original ||
          profile.coverImage.large ||
          profile.coverImage.medium ||
          profile.coverImage.small ||
          null;

        if (isEmpty(coverURL)) return;
        NavigationActions.showLightBox([coverURL]);
        break;
      }
      default:
        console.log('unhandled profile option selected:', option);
        break;
    }
  }

  onEditProfile = async (changes) => {
    try {
      this.setState({ editModalVisible: false, loading: true });
      const { userId } = this.props;
      const data = await Kitsu.update('users', {
        id: userId,
        ...changes,
      }, { include: 'waifu' });

      // Bust the cover cache
      if (data && data.coverImage) {
        const bustedCovers = this.applyCacheBust(data.coverImage);
        data.coverImage = bustedCovers;
      }

      this.setState({ profile: data });
      await fetchCurrentUser();
    } catch (err) {
      console.log('Error updating user:', err);
    } finally {
      this.setState({ loading: false });
    }
  }

  setActiveTab = (tab) => {
    if (tab) {
      this.setState({ active: tab.toLowerCase() });
      if (this.scrollView) this.scrollView.scrollTo({ x: 0, y: coverImageHeight, animated: true });
    }
  }

  fetchLibraryActivity = async () => {
    const { userId } = this.props;

    this.setState({ loadingLibraryActivity: true });

    try {
      const libraryActivity = await Kitsu.findAll('libraryEvents', {
        page: { limit: 20 },
        filter: { userId },
        sort: '-createdAt',
        include: 'libraryEntry.media',
      });

      this.setState({
        loadingLibraryActivity: false,
        libraryActivity,
      });
    } catch (error) {
      console.log('Error while fetching library entries: ', error);

      this.setState({
        loadingLibraryActivity: false,
      });
    }
  }

  fetchReactions = async () => {
    const { userId } = this.props;

    this.setState({ loadingReactions: true });

    try {
      const reactions = await Kitsu.findAll('mediaReactions', {
        filter: { userId },
        include: 'anime,user,manga',
        sort: 'upVotesCount',
      });

      this.setState({
        reactions,
        loadingReactions: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving reactions: ', err);
      this.setState({
        loadingReactions: false,
      });
    }
  }

  fetchGroups = async () => {
    this.setState({ loadingGroups: true });
    try {
      const groups = await Kitsu.findAll('group-members', {
        fields: {
          group: 'slug,name,avatar,tagline',
        },
        filter: {
          query_user: this.props.userId,
        },
        include: 'group.category',
        sort: '-created_at',
      });

      this.setState({
        groups,
        loadingGroups: false,
      });
    } catch (err) {
      console.log('Unhandled error while retrieving groups: ', err);
      this.setState({ loadingGroups: false });
    }
  }

  fetchStats = async () => {
    this.setState({ loadingStats: true });
    try {
      const stats = await Kitsu.findAll('stats', {
        filter: {
          user_id: this.props.userId,
        }
      });
      this.setState({ stats, loadingStats: false });
    } catch (err) {
      console.log('Unhandled error while fetching stats:', err);
      this.setState({ loadingStats: false });
    }
  }

  /**
   * Apply image cache bust to the given object.
   * This will loop through each object property and check if the value is a url
   * If it is then it will try apply a cache bust if it's not present.
   *
   * @param {any} object An object to apply cache bust to
   * @returns The cache busted object
   */
  applyCacheBust(object) {
    if (typeof object !== 'object') return object;

    const updated = object;
    Object.keys(object).forEach((key) => {
      const url = object[key];
      const parsed = parseURL(url);
      if (parsed) {
        // If we have the url but don't have any search params in it
        // Then we know we have to apply a cache buster
        if (isEmpty(parsed.search) && !isEmpty(url)) {
          updated[key] = `${url}?${Date.now()}`;
        }
      }
    });

    return updated;
  }


  goBack = () => {
    Navigation.pop(this.props.componentId);
  }

  loadUserData = async (userId) => {
    try {
      const users = await Kitsu.findAll('users', {
        filter: {
          id: userId,
        },
        fields: {
          users: 'slug,waifuOrHusbando,gender,location,birthday,createdAt,followersCount,followingCount,coverImage,avatar,about,name,waifu',
          characters: 'name,image,description',
        },
        include: 'waifu',
      });

      if (users.length < 1) {
        console.log(`Could not locate user with ID ${userId}.`);

        this.setState({
          loading: false,
          error: 'Could not find that user.',
        });

        return;
      }

      this.setState({
        loading: false,
        profile: users[0],
      });
    } catch (error) {
      console.log('Error loading user: ', error);

      this.setState({
        loading: false,
        error,
      });
    }
  }

  fetchFollow = async (userId) => {
    try {
      const isCurrentUser = isIdForCurrentUser(userId, this.props.currentUser);
      if (isCurrentUser) { return; }
      this.setState({ isLoadingFollow: true });
      const response = await Kitsu.findAll('follows', {
        filter: {
          follower: this.props.currentUser.id,
          followed: userId,
        },
      });
      const record = response && response[0];
      this.setState({ follow: record, isLoadingFollow: false });
    } catch (err) {
      console.log('Error fetching follow:', err);
    }
  }

  createFollow = async (userId) => {
    try {
      this.setState({ isLoadingFollow: true });
      const record = await Kitsu.create('follows', {
        follower: {
          id: this.props.currentUser.id,
          type: 'users',
        },
        followed: {
          id: userId,
          type: 'users',
        },
      });
      this.setState({ follow: record, isLoadingFollow: false });
    } catch (err) {
      console.log('Error creating follow:', err);
    }
  }

  handleFollowing = async () => {
    const { userId } = this.props;
    const isCurrentUser = isIdForCurrentUser(userId, this.props.currentUser);
    if (isCurrentUser) { // Edit
      this.setState({ editModalVisible: true });
    } else if (this.state.follow) { // Destroy
      this.setState({ isLoadingFollow: true });
      await Kitsu.destroy('follows', this.state.follow.id);
      this.setState({ follow: null, isLoadingFollow: false });
    } else { // Create
      await this.createFollow(userId);
    }
  }

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map(tabItem => (
        <TabBarLink
          key={tabItem.key}
          label={tabItem.label}
          isActive={this.state.active === tabItem.key}
          onPress={() => this.setActiveTab(tabItem.key)}
        />
      ))}
    </TabBar>
  );

  renderTabs = () => (
    <View style={{ flex: 1 }}>
      {this.renderTabNav()}
      {TAB_ITEMS.map((tabItem) => {
        return this.renderTab(tabItem.screen, tabItem.key);
      })}
    </View>
  );

  renderTab = (Component, key) => {
    const { userId, componentId, currentUser } = this.props;
    const {
      loadingLibraryActivity,
      libraryActivity,
      loadingReactions,
      reactions,
      loadingGroups,
      groups,
      stats,
      loadingStats,
      active,
    } = this.state;

    // Don't render tabs that are not visible
    if (key !== active) return null;

    const otherProps = {
      userId,
      componentId,
      currentUser,
      loadingLibraryActivity,
      libraryActivity,
      loadingReactions,
      reactions,
      loadingGroups,
      groups,
      loadingStats,
      stats,
    };

    return (
      <Component
        key={key}
        setActiveTab={this.setActiveTab}
        profile={this.state.profile}
        {...otherProps}
      />
    );
  }

  render() {
    const { error, loading, profile, follow, isLoadingFollow, editModalVisible } = this.state;

    if (loading) {
      return (
        <SceneContainer>
          <CustomHeader
            leftButtonAction={this.goBack}
            leftButtonTitle="Back"
          />
          <SceneLoader />
        </SceneContainer>
      );
    }

    if (error) {
      return <ErrorPage onBackPress={this.goBack} />;
    }

    const { userId } = this.props;
    const isCurrentUser = isIdForCurrentUser(userId, this.props.currentUser);
    const mainButtonTitle = isCurrentUser ? 'Edit' : follow ? 'Unfollow' : 'Follow';

    // There's no way to Report Profiles at the moment in the API.
    const MORE_BUTTON_OPTIONS = [
      { text: 'Share Profile Link', value: 'share' },
      // Only display if user has a valid cover image
      { text: 'View Cover Image', value: 'cover', if: i => !!(i && i.coverImage) },
      /* 'Report Profile', */
      'Nevermind',
    ].filter(item => (item.if ? item.if(profile) : true));
    if (!isCurrentUser) {
      MORE_BUTTON_OPTIONS.unshift('Block');
    }

    return (
      <SceneContainer>
        <StatusBar barStyle="light-content" />
        <ParallaxScroll
          innerRef={(r) => { this.parallaxScroll = r; }}
          style={{ flex: 1 }}
          headerHeight={HEADER_HEIGHT}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{
                uri: getImgixCoverImage(profile.coverImage, {
                  h: coverImageHeight * 2,
                  w: scene.width * 2,
                  'max-h': null,
                }) || defaultCover,
              }}
            />
          )}
          renderHeader={() => (
            <CustomHeader
              leftButtonAction={this.goBack}
              leftButtonTitle="Back"
            />
          )}
          headerFixedBackgroundColor={listBackPurple}
        >
          <SceneHeader
            variant="profile"
            title={profile.name}
            description={profile.about}
            posterImage={profile.avatar && profile.avatar.large}
            followersCount={profile.followersCount}
            followingCount={profile.followingCount}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            mainButtonTitle={mainButtonTitle}
            mainButtonLoading={isLoadingFollow}
            onFollowButtonPress={this.handleFollowing}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabs()}
        </ParallaxScroll>

        <EditModal
          user={profile}
          visible={editModalVisible}
          onConfirm={(changes) => this.onEditProfile(changes)}
          onCancel={() => this.setState({ editModalVisible: false })}
        />
      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps, { fetchCurrentUser, fetchUserLibrary })(ProfilePage);
