import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, SectionList, Share } from 'react-native';
import { TabRouter } from 'react-navigation';
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
import { Lightbox } from 'kitsu/utils/lightbox';
import Summary from './pages/Summary';
import { Feed } from './pages/Feed';

const HEADER_HEIGHT = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);

const tabPage = name => ({ key: name.toLowerCase(), label: name, screen: name });

const TAB_ITEMS = [
  tabPage('Summary'),
  tabPage('Feed'),
  tabPage('About'),
  tabPage('Library'),
  tabPage('Groups'),
  tabPage('Reactions'),
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Feed: { screen: Feed },
  About: { getScreen: () => require('./pages/About').About },
  Library: { getScreen: () => require('./pages/Library').Library },
  Groups: { getScreen: () => require('./pages/Groups').Groups },
  // Following: { getScreen: () => require('./pages/Following').Following },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
}, {
  initialRouteName: 'Summary',
});

class ProfilePage extends PureComponent {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    userId: PropTypes.number,
    currentUser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    userId: null,
  }

  state = {
    active: 'Summary',
    loading: true,
    error: null,
    profile: null,
    feed: null,
    follow: null,
    isLoadingFollow: false,
    editModalVisible: false,
  }

  componentWillMount() {
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;

    if (!userId) {
      this.setState({
        loading: false,
        error: 'Missing userId in component.',
      });
      return;
    }

    this.loadUserData(userId);
    this.fetchFollow(userId);
  }

  componentWillUnmount() {
    this.setState({ editModalVisible: false });
  }

  onMoreButtonOptionsSelected = async (button) => {
    const { currentUser } = this.props;
    const { profile } = this.state;
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;

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
        Lightbox.show([coverURL]);
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
      const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;
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

  onFollowTabPress = () => {
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;

    this.props.navigation.navigate('FollowPage', {
      userId,
      currentUser: this.props.currentUser,
    });
  };

  setActiveTab = (tab) => {
    this.setState({ active: tab });
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
    this.props.navigation.goBack();
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
        filter :{
          follower: this.props.currentUser.id,
          followed: userId
        }
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
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;
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
          isActive={this.state.active === tabItem.screen}
          onPress={() => this.setActiveTab(tabItem.screen)}
        />
      ))}
    </TabBar>
  );

  renderTabScene = () => {
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);
    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;
    const { navigation } = this.props;
    return (
      <TabScene
        key="tabScene"
        setActiveTab={tab => this.setActiveTab(tab)}
        userId={userId}
        navigation={navigation}
        currentUser={this.props.currentUser}
        profile={this.state.profile}
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

    const userId = this.props.userId || (this.props.navigation.state.params || {}).userId;
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
            onFollowTabPress={this.onFollowTabPress}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          <SectionList
            style={{ flex: 1 }}
            stickySectionHeadersEnabled
            renderSectionHeader={({ section }) => section.title}
            renderItem={({ item }) => item}
            sections={[
              { data: [this.renderTabScene()], title: this.renderTabNav() },
            ]}
          />
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

export default connect(mapStateToProps, { fetchCurrentUser })(ProfilePage);
