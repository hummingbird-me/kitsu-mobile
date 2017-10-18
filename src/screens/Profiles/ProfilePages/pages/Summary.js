import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import capitalize from 'lodash/capitalize';
import {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
} from 'kitsu/store/profile/actions';
import { getUserFeed } from 'kitsu/store/feed/actions';

import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { StyledText } from 'kitsu/components/StyledText';

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
    } = this.props;
    return (
      <SceneContainer>
        {/* Library Activity */}
        <ScrollableSection
          contentDark
          title="Library activity"
          onViewAllPress={() => this.navigateTo('Library')}
          data={this.formatData(entries)}
          renderItem={({ item }) => {
            const activity = item.activities[0];
            let caption = '';
            if (activity.verb === 'progressed') {
              caption = `${activity.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'} ${activity.progress}`;
            } else if (activity.verb === 'updated') {
              caption = `${capitalize(activity.status.replace('_', ' '))}`;
            } else if (activity.verb === 'rated') {
              caption = `Rated: ${activity.rating}`;
            }

            return (
              <ScrollItem>
                <ImageCard
                  noMask
                  variant="portraitLarge"
                  source={{
                    uri: activity.media.posterImage && activity.media.posterImage.original,
                  }}
                />
                <View style={{ alignItems: 'center', marginTop: 3 }}>
                  <StyledText size="xxsmall">{caption}</StyledText>
                </View>
              </ScrollItem>
            );
          }}
        />

        {/* Reactions */}
        {/* Todo KB: get real data */}
        <ScrollableSection
          title="Reactions"
          titleAction={() => {}}
          titleLabel="Write reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                subtitle="Ep. 1 of 12"
                title={item.canonicalTitle}
                variant="landscapeLarge"
                source={{
                  uri:
                    (item.thumbnail && item.thumbnail.original) ||
                    (media.posterImage && media.posterImage.large),
                }}
              />
            </ScrollItem>
          )}
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
