import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { TabRouter } from 'react-navigation';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Kitsu } from 'kitsu/config/api';
import { defaultCover } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Summary } from 'kitsu/screens/Profiles/MediaPages/pages/Summary';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { coverImageHeight } from 'kitsu/screens/Profiles/constants';

const MAIN_BUTTON_OPTIONS = ['Watch', 'Want to Watch', 'Completed', 'On Hold', 'Dropped', 'Cancel', 'Nevermind'];
const MORE_BUTTON_OPTIONS = ['Add to Favorites', 'Follow this Anime\'s Feed', 'Nevermind'];

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
  // TODO: Change label to Chapters for Manga.
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
  }

  static navigationOptions = {
    header: null,
  }

  state = {
    active: 'Summary',
    loading: false, // Check whether basic data is loading
    media: null,
    castings: null,
    mediaReactions: null,
    loadingAdditional: false, // Check whether episodes & Related are loading
  }

  componentDidMount = () => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    this.fetchMedia(mediaType, mediaId);
  }

  onMainButtonOptionsSelected = () => {}
  onMoreButtonOptionsSelected = () => {}

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  goBack = () => this.props.navigation.goBack();

  /**
   * Fetch the media information
   */
  fetchMedia = async (type, id) => {
    this.setState({ loading: true, loadingAdditional: true });
    try {
      // Fetch the media with categories
      const media = await Kitsu.one(type, id).get({
        include: 'categories',
      });

      // Set the initial media info
      this.setState({
        loading: false,
        media,
      });

      // Lazy load the rest
      this.fetchEpisodesAndRelated(type, id);
      this.fetchOther(type, id);
    } catch (error) {
      // OH NO!
      this.setState({
        loading: false,
        error,
      });
    }
  }

  /**
   * Fetch the episodes/chapter and related media types
   */
  fetchEpisodesAndRelated = async (type, id) => {
    // To make this simple, we'll just refetch the media object with these fields.
    Kitsu.one(type, id).get({
      include: `mediaRelationships.destination,${type === 'anime' ? 'episodes' : 'chapters'}`,
    })
      .then((media) => {
        // Combine the 2 object that we have
        this.setState({
          media: { ...media, categories: this.state.media.categories },
          loadingAdditional: false,
        });
      });
  };

  /**
   * Fetch the other media information
   */
  fetchOther = async (type, id) => {
    Promise.all([
      Kitsu.findAll('castings', {
        filter: {
          mediaId: id,
          isCharacter: true,
        },
        sort: '-featured',
        include: 'character',
      }),
      Kitsu.findAll('mediaReactions', {
        filter: {
          [`${type}Id`]: id,
        },
        include: 'user',
        sort: '-upVotesCount',
      }),
    ])
      .then(([castings, mediaReactions]) => {
        this.setState({
          castings,
          mediaReactions,
        });
      });
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
    const {
      castings,
      error,
      loading,
      media,
      mediaReactions,
      loadingAdditional,
    } = this.state;
    const TabScene = TabRoutes.getComponentForRouteName(this.state.active);
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

    if (error || !media) {
      return null;
    }

    return (
      <SceneContainer>
        <StatusBar barStyle="light-content" />
        <ParallaxScroll
          style={{ flex: 1 }}
          headerHeight={60}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{ uri: (media.coverImage && media.coverImage.original) || defaultCover }}
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
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onMainButtonOptionsSelected={this.onMainButtonOptionsSelected}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabNav()}
          <TabScene
            setActiveTab={tab => this.setActiveTab(tab)}
            media={media}
            mediaId={media.id}
            mediaReactions={mediaReactions}
            castings={castings}
            navigation={navigation}
            loadingAdditional={loadingAdditional}
          />
        </ParallaxScroll>
      </SceneContainer>
    );
  }
}

export default MediaPages;
