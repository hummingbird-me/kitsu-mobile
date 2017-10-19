import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { FlatList, View } from 'react-native';
import {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
} from 'kitsu/store/profile/actions';
import { getUserFeed } from 'kitsu/store/feed/actions';

import { InfoRow } from 'kitsu/screens/Profiles/components/InfoRow';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MediaRow } from 'kitsu/screens/Profiles/components/MediaRow';
import { styles } from './styles';

const ItemSeparator = () => <View style={{ height: 10 }} />

class About extends Component {
  componentDidMount() {
    const { userId } = this.props;
    this.props.fetchProfile(userId);
    this.props.fetchUserFeed(userId, 12);
    this.props.fetchProfileFavorites(userId, 'character');
    this.props.fetchProfileFavorites(userId, 'manga');
    this.props.fetchProfileFavorites(userId, 'anime');
    this.props.getUserFeed(userId);
  }

  render() {
    const { profile } = this.props;
    const waifuOrHusbandoComponent = (
      <MediaRow
        imageVariant="thumbnail"
        title={profile.waifu.name}
        thumbnail={{ uri: profile.waifu.image && profile.waifu.image.original }}
        summary={profile.waifu.description}
        summaryLines={2}
      />
    );
    const aboutRows = [
      { key: 'waifuOrHusbando', label: profile.waifuOrHusbando, contentComponent: waifuOrHusbandoComponent },
      { key: 'gender', label: 'Gender', content: profile.gender },
      { key: 'location', label: 'Location', content: profile.location },
      { key: 'birthday', label: 'Birthday', content: moment(profile.birthday).format('MMMM Do') },
      { key: 'joinDate', label: 'Join date', content: moment(profile.createdAt).format('MMMM Do, YYYY') },
    ];
    return (
      <SceneContainer>
        <FlatList
          style={{ marginTop: 10 }}
          data={aboutRows}
          renderItem={({ item }) => (
            <InfoRow
              label={item.label}
              content={item.content}
              contentComponent={(item.key === 'waifuOrHusbando' && item.contentComponent) && item.contentComponent}
            />
          )}
          ItemSeparatorComponent={() => <ItemSeparator />}
        />
      </SceneContainer>
    );
  }
}

About.propTypes = {
  loading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired,
  fetchProfileFavorites: PropTypes.func.isRequired,
  fetchUserFeed: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  getUserFeed: PropTypes.func.isRequired,
};

About.defaultProps = {
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
export const component = connect(mapStateToProps, {
  fetchProfile,
  fetchProfileFavorites,
  fetchUserFeed,
  getUserFeed,
})(About);
