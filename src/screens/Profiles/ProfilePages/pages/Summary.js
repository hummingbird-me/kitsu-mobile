import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
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

// TODO: Note I shouldn't be needed once we can pass params with React Navigation properly.
// https://github.com/react-community/react-navigation/issues/143
// import { requests } from 'kitsu/screens/Profiles/MediaPages';

class Summary extends PureComponent {
  static propTypes = {
    setActiveTab: PropTypes.func,
    userId: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    entries: PropTypes.array.isRequired,
    fetchProfileFavorites: PropTypes.func.isRequired,
    fetchUserFeed: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    getUserFeed: PropTypes.func.isRequired,
  }

  static defaultProps = {
    setActiveTab: null,
    loading: false,
  }

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

  navigateToMedia = (media, profileName) => {
    // TODO: Does React Navigation allow us to pass params yet?
    //
    // We need to do two navigate actions here or the params aren't
    // passed through to the media page. See:
    // https://github.com/react-community/react-navigation/issues/143
    //
    // e.g. if that bug is ever fixed, this should work:
    // this.props.navigation.navigate('MediaPages', { media });
    //
    // but it doesn't pass the params for now, so we tried to work around
    // it by doing this, which was a thing in the issue:
    // this.props.navigation.dispatch(NavigationActions.navigate({
    //   routeName: 'Search',
    //   action: NavigationActions.navigate({
    //     routeName: 'MediaPages',
    //     params: { media },
    //   }),
    // }));
    //
    // But that didn't work either, so...FML.
    //
    // And media pages will clear it up for us once it reads its singleton on mount.
    // requests.requestedMediaId = media.id;
    // requests.requestedMediaType = media.type;
    this.props.navigation.navigate('MediaPages', { mediaId: media.id, mediaType: media.type, profileName });
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
                <TouchableOpacity
                  onPress={() => this.navigateToMedia(
                    item.activities[0].media,
                    this.props.profile.name,
                  )}
                >
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
                </TouchableOpacity>
              </ScrollItem>
            );
          }}
        />

        {/* Reactions */}
        {/* Todo KB: get real data */}
        <ScrollableSection
          title="Reactions"
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
    userId,
    loading,
    navigation,
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
