import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';

import {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
} from 'kitsu/store/profile/actions';
import { getUserFeed } from 'kitsu/store/feed/actions';

import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components';
import Summary from 'kitsu/screens/Profiles/ProfilePages/pages/Summary';

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'about', label: 'About', screen: 'About' },
  { key: 'library', label: 'Library', screen: 'Library' },
  { key: 'groups', label: 'Groups', screen: 'Groups' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
];

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  About: { getScreen: () => require('./pages/About').default},
  Library: { getScreen: () => require('./pages/Library').default},
  Groups: { getScreen: () => require('./pages/Groups').default},
  Reactions: { getScreen: () => require('./pages/Reactions').default},
}, {
  initialRouteName: 'Summary',
});

class ProfilePage extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
      height: 20,
    },
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

  setActiveTab = (tab) => {
    this.setState({ active: tab });
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

  render() {
    const { profile, entries } = this.props;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);
    return (
      <SceneContainer>
        <ScrollView stickyHeaderIndices={[1]}>
          <SceneHeader
            variant="profile"
            title={profile.name}
            description={profile.about}
            coverImage={profile.coverImage && profile.coverImage.large}
            posterImage={profile.avatar && profile.avatar.large}
            followersCount={profile.followersCount}
            followingCount={profile.followingCount}
          />
          {this.renderTabNav()}
          <TabScene setActiveTab={(tab) => this.setActiveTab(tab)} />
        </ScrollView>
      </SceneContainer>
    );
  }
}

ProfilePage.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  fetchProfileFavorites: PropTypes.func.isRequired,
  fetchUserFeed: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  getUserFeed: PropTypes.func.isRequired,
};

ProfilePage.defaultProps = {
  loading: false,
  navigation: {},
  profile: {},
  fetchProfileFavorites: {},
  fetchUserFeed: {},
  fetchProfile: {},
  getUserFeed: {},
};

const mapStateToProps = (state, ownProps) => {
  const { navigation } = ownProps;
  const { profile, loading, character, manga, anime, library, favoritesLoading } = state.profile;
  const { currentUser } = state.user;

  // let userId = currentUser.id;
  // if (navigation.state.params && navigation.state.params.userId) {
  //   userId = navigation.state.params.userId;
  // }

  const userId = 5554;

  const c = (character[userId] && character[userId].map(({ item }) => item)) || [];
  const m = (manga[userId] && manga[userId].map(({ item }) => item)) || [];
  const a = (anime[userId] && anime[userId].map(({ item }) => item)) || [];
  const l = library[userId] || [];
  const { userFeed, loadingUserFeed } = state.feed;
  const filteredFeed = userFeed.filter(
    ({ activities }) => !['comment', 'follow'].includes(activities[0].verb),
  );
  return {
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
