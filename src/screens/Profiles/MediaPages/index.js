import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';

import { Kitsu } from 'kitsu/config/api';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import Summary from 'kitsu/screens/Profiles/MediaPages/pages/Summary';

const MAIN_BUTTON_OPTIONS = ['Watch', 'Want to Watch', 'Completed', 'On Hold', 'Dropped', 'Cancel', 'Nevermind'];
const MORE_BUTTON_OPTIONS = ['Add to Favorites', 'Follow this Anime\'s Feed', 'Nevermind'];

// TODO: Note we're using this to work around a bug in React Navigation:
// https://github.com/react-community/react-navigation/issues/143
export const requests = {};

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes' },
  { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
  { key: 'franchise', label: 'Franchise', screen: 'Franchise' },
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Episodes: { getScreen: () => require('./pages/Episodes').Episodes },
  Characters: { getScreen: () => require('./pages/Characters').Characters },
  Reactions: { getScreen: () => require('./pages/Reactions').Reactions },
  Franchise: { getScreen: () => require('./pages/Franchise').Franchise },
}, {
  initialRouteName: 'Summary',
});

/* eslint-enable global-require */

class MediaPages extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    mediaId: PropTypes.string,
    mediaType: PropTypes.string,
  }

  static defaultProps = {
    mediaId: null,
    mediaType: null,
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'transparent',
      height: 20,
    },
  }

  state = {
    active: 'Summary',
    loading: true,
    media: null,
    castings: null,
    mediaReactions: null,
  }

  componentDidMount = () => {
    const mediaType = requests.requestedMediaType ||
      (this.props.navigation.state.params || {}).mediaType ||
      this.props.mediaType;

    const mediaId = requests.requestedMediaId ||
      (this.props.navigation.state.params || {}).mediaId ||
      this.props.mediaId;

    this.fetchMedia(mediaType, mediaId);

    if (requests.requestedMediaId) {
      delete requests.requestedMediaId;
    }
  }

  onMainButtonOptionsSelected = () => {}
  onMoreButtonOptionsSelected = () => {}

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  fetchMedia = async (type, id) => {
    try {
      const media = await Kitsu.one(type, id).get({
        include: `categories,mediaRelationships.destination,${type === 'anime' ? 'episodes' : 'chapters'}`,
      });

      // Now that we've got the media, everything else can go async together.
      const promises = [];

      promises.push(Kitsu.findAll('castings', {
        filter: {
          mediaId: id,
          isCharacter: true,
        },
        sort: '-featured',
        include: 'character',
      }));

      promises.push(Kitsu.findAll('mediaReactions', {
        filter: {
          [`${type}Id`]: id,
        },
        include: 'user',
        sort: '-upVotesCount',
      }));

      const [
        castings,
        mediaReactions,
      ] = await Promise.all(promises);

      this.setState({
        media,
        castings,
        mediaReactions,
      });
    } catch (error) {
      console.log('Error fetching media.', err);
      this.setState({ error });
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

  render() {
    const { error, loading, media } = this.state;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);

    if (loading) {
      // Return loading state
      return null;
    }

    if (error) {
      // Return error state
      return null;
    }

    return (
      <SceneContainer>
        <ScrollView stickyHeaderIndices={[1]}>
          <SceneHeader
            variant="media"
            media={media}
            type={media.type}
            title={media.canonicalTitle}
            description={media.synopsis}
            coverImage={media.coverImage && media.coverImage.original}
            posterImage={media.posterImage && media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            categories={media.categories}
            mainButtonTitle="Add to library"
            mainButtonOptions={MAIN_BUTTON_OPTIONS}
            onMainButtonOptionsSelected={this.onMainButtonOptionsSelected}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabNav()}
          <TabScene setActiveTab={tab => this.setActiveTab(tab)} />
        </ScrollView>
      </SceneContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media } = state.media;

  return {
    media: media[12],
  };
};

export default connect(mapStateToProps, {})(MediaPages);
