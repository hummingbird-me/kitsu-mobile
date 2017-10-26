import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
} from 'kitsu/store/profile/actions';
import { getUserFeed } from 'kitsu/store/feed/actions';
import { Kitsu } from 'kitsu/config/api';
import { defaultCover } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import Summary from 'kitsu/screens/Profiles/ProfilePages/pages/Summary';
import { coverImageHeight } from 'kitsu/screens/Profiles/constants';

// There's no way to Report Profiles at the moment in the API.
const MORE_BUTTON_OPTIONS = ['Block', /* 'Report Profile', */ 'Nevermind'];

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'about', label: 'About', screen: 'About' },
  { key: 'library', label: 'Library', screen: 'Library' },
  { key: 'groups', label: 'Groups', screen: 'Groups' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  About: { getScreen: () => require('./pages/About').About },
  Library: { getScreen: () => require('./pages/Library').Library },
  Groups: { getScreen: () => require('./pages/Groups').Groups },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
}, {
  initialRouteName: 'Summary',
});

class ProfilePage extends Component {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    userId: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired,
    fetchProfileFavorites: PropTypes.func.isRequired,
    fetchUserFeed: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    getUserFeed: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loading: false,
    navigation: {},
    profile: {},
    fetchProfileFavorites: {},
    fetchUserFeed: {},
    fetchProfile: {},
    getUserFeed: {},
  }

  state = { active: 'Summary' }

  componentDidMount() {
    const { userId } = this.props;
    this.props.fetchProfile(userId);
    this.props.fetchUserFeed(userId, 12);
    this.props.fetchProfileFavorites(userId, 'character');
    this.props.fetchProfileFavorites(userId, 'manga');
    this.props.fetchProfileFavorites(userId, 'anime');
    this.props.getUserFeed(userId);
  }

  onMoreButtonOptionsSelected = async (button) => {
    if (button === 'Block') {
      await Kitsu.create('blocks', {
        blocked: { id: this.props.userId },
        user: { id: this.props.currentUser.id },
      });
    } else if (button === 'Report Profile') {
      // There's no current way to report users from the site.
      // Once there is, the API call goes here.
    }
  }

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  goBack = () => this.props.navigation.goBack();

  handleFollowing = () => {}

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

  render() {
    const { profile, userId, navigation } = this.props;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);
    return (
      <SceneContainer>
        <StatusBar barStyle="light-content" />
        <ParallaxScroll
          headerHeight={60}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{ uri: (profile.coverImage && profile.coverImage.large) || defaultCover }}
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
            onFollowButtonPress={this.handleFollowing}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabNav()}
          <TabScene
            setActiveTab={tab => this.setActiveTab(tab)}
            userId={userId}
            navigation={navigation}
          />
        </ParallaxScroll>
      </SceneContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { navigation } = ownProps;
  const { profile, loading, character, manga, anime, library, favoritesLoading } = state.profile;
  const { currentUser } = state.user;

  // let userId = currentUser.id;
  // if (navigation.state.params && navigation.state.params.userId) {
  //   userId = navigation.state.params.userId;
  // }

  const userId = 33287;

  const c = (character[userId] && character[userId].map(({ item }) => item)) || [];
  const m = (manga[userId] && manga[userId].map(({ item }) => item)) || [];
  const a = (anime[userId] && anime[userId].map(({ item }) => item)) || [];
  const l = library[userId] || [];
  const { userFeed, loadingUserFeed } = state.feed;
  const filteredFeed = userFeed.filter(
    ({ activities }) => !['comment', 'follow'].includes(activities[0].verb),
  );
  return {
    navigation,
    userId,
    loading,
    profile: profile[userId] || {},
    currentUser,
    favorite: {
      characters: [...c],
      manga: [...m],
      anime: [...a],
    },
    entries: [...l],
    favoritesLoading,
    userFeed: filteredFeed,
    loadingUserFeed,
  };
};

export default connect(mapStateToProps, {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
  getUserFeed,
})(ProfilePage);
