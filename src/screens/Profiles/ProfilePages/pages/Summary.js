import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
} from 'kitsu/store/profile/actions';
import { getUserFeed } from 'kitsu/store/feed/actions';

import { LibraryActivityBox } from 'kitsu/screens/Profiles/MediaPages/components/LibraryActivityBox';
import { ReactionsBox } from 'kitsu/screens/Profiles/MediaPages/components';
import { SceneContainer } from 'kitsu/screens/Profiles/MediaPages/components';

class Summary extends Component {
  componentDidMount() {
    const { userId } = this.props;
    this.props.fetchProfile(userId);
    this.props.fetchUserFeed(userId, 12);
    this.props.fetchProfileFavorites(userId, 'character');
    this.props.fetchProfileFavorites(userId, 'manga');
    this.props.fetchProfileFavorites(userId, 'anime');
    this.props.getUserFeed(userId);
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  render() {
    const {
      entries,
      favorite,
    } = this.props;
    return (
      <SceneContainer>
        <LibraryActivityBox
          contentDark
          title="Library activity"
          data={this.formatData(entries)}
          onViewAllPress={() => this.navigateTo('Library')}
        />
        <ReactionsBox
          title="Reactions"
          titleAction={() => {}}
          titleLabel="Write reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
        />
      </SceneContainer>
    );
  }
}

Summary.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired,
  fetchProfileFavorites: PropTypes.func.isRequired,
  fetchUserFeed: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  getUserFeed: PropTypes.func.isRequired,
};

Summary.defaultProps = {
  loading: false,
  navigation: {},
  profile: {},
  entries: [],
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
})(Summary);
