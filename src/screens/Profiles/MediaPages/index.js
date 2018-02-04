import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { TabRouter } from 'react-navigation';
import { connect } from 'react-redux';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { Kitsu } from 'kitsu/config/api';
import { defaultCover, statusBarHeight, navigationBarHeight } from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Summary } from 'kitsu/screens/Profiles/MediaPages/pages/Summary';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { coverImageHeight } from 'kitsu/screens/Profiles/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import capitalize from 'lodash/capitalize';

const HEADER_HEIGHT = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);
const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes', if: (state) => state.media.type === 'anime'},
  { key: 'chapters', label: 'Chapters', screen: 'Episodes', if: (state) => state.media.type === 'manga'},
  { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: 'Reactions' },
  { key: 'franchise', label: 'Franchise', screen: 'Franchise' },
];

/* eslint-disable global-require */

const TabRoutes = TabRouter({
  Summary: { screen: Summary },
  Episodes: { getScreen: () => require('./pages/Episodes').Episodes },
  Chapters: { getScreen: () => require('./pages/Episodes').Episodes },
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
    favorite: null,
    libraryEntry: null,
    loadingLibrary: false,
    loadingAdditional: false, // Check whether episodes & Related are loading
  }

  componentDidMount = () => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    this.fetchMedia(mediaType, mediaId);
    this.fetchFavorite(mediaType, mediaId);
    this.fetchLibraryEntry(mediaType, mediaId);
  }

  createLibraryEntry = async (status) => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    try {
      this.setState({ loadingLibrary: true });
      const record = await Kitsu.create('libraryEntries', {
        status,
        [mediaType]: {
          id: mediaId,
          type: mediaType
        },
        user: {
          id: this.props.currentUser.id,
          type: 'users'
        }
      });
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error creating library entry:', err);
    }
  }

  updateLibraryEntry = async (status) => {
    const { libraryEntry } = this.state;
    const { mediaId, mediaType } = this.props.navigation.state.params;
    try {
      this.setState({ loadingLibrary: true });
      const record = await Kitsu.update('libraryEntries', {
        id: libraryEntry.id,
        status
      });
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error updating library entry:', err);
    }
  }

  onMainButtonOptionsSelected = async (option) => {
    const { libraryEntry } = this.state;
    switch (option) {
      case 'current':
      case 'planned':
      case 'completed':
      case 'on_hold':
      case 'dropped':
        libraryEntry ? await this.updateLibraryEntry(option) : await this.createLibraryEntry(option);
        break;
      case 'remove':
        this.setState({ loadingLibrary: true });
        await Kitsu.destroy('libraryEntries', libraryEntry.id);
        this.setState({ libraryEntry: null, loadingLibrary: false });
        break;
      default:
        console.log('unhandled option selected:', option);
        break;
    }
  }

  onMoreButtonOptionsSelected = async (option) => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    switch (option) {
      case 'add':
        const record = await Kitsu.create('favorites', {
          item: {
            id: mediaId,
            type: mediaType
          },
          user: {
            id: this.props.currentUser.id,
            type: 'users'
          }
        });
        this.setState({ favorite: record });
        break;
      case 'remove':
        await Kitsu.destroy('favorites', this.state.favorite.id);
        this.setState({ favorite: null });
        break;
      default:
        console.log('unhandled option selected:', option);
        break;
    }
  }

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
    try {
      // To make this simple, we'll just refetch the media object with these fields.
      const media = await Kitsu.one(type, id).get({
        include: `mediaRelationships.destination,${type === 'anime' ? 'episodes' : 'chapters'}`,
      });

      // Combine the 2 object that we have
      this.setState({
        media: { ...media, categories: this.state.media.categories },
        loadingAdditional: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Fetch the other media information
   */
  fetchOther = async (type, id) => {
    try {
      const [
        castings,
        mediaReactions,
      ] = await Promise.all([
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
      ]);

      this.setState({
        castings,
        mediaReactions,
      });
    } catch (error) {
      console.log(error);
    }
  }

  fetchFavorite = async (type, id) => {
    try {
      const response = await Kitsu.findAll('favorites', {
        filter: {
          item_type: capitalize(type),
          item_id: id,
          user_id: this.props.currentUser.id
        }
      });
      const record = response && response[0];
      this.setState({ favorite: record });
    } catch (err) {
      console.log('Error fetching favorite state:', err);
    }
  }

  fetchLibraryEntry = async (type, id) => {
    try {
      this.setState({ loadingLibrary: true });
      const response = await Kitsu.findAll('libraryEntries', {
        filter: {
          user_id: this.props.currentUser.id,
          [`${type}_id`]: id
        }
      });
      const record = response && response[0];
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error fetching library entry:', err);
    }
  }

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map(tabItem => {
        // If this tab item is conditional, run the check
        if (tabItem.if && !tabItem.if(this.state)) {
          return;
        }
        return (
          <TabBarLink
            key={tabItem.key}
            label={tabItem.label}
            isActive={this.state.active === tabItem.screen}
            onPress={() => this.setActiveTab(tabItem.screen)}
          />
        );
      })}
    </TabBar>
  );

  render() {
    const {
      castings,
      error,
      loading,
      media,
      mediaReactions,
      favorite,
      libraryEntry,
      loadingLibrary,
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

    // Handle dynamic button options (TODO: Cleanup)
    let MAIN_BUTTON_OPTIONS = [
      { text: 'Watch', value: 'current', if: (type) => type === 'anime' },
      { text: 'Read', value: 'current', if: (type) => type === 'manga' },
      { text: 'Want to Watch', value: 'planned', if: (type) => type === 'anime' },
      { text: 'Want to Read', value: 'planned', if: (type) => type === 'manga' },
      { text: 'Completed', value: 'completed' },
      { text: 'On Hold', value: 'on_hold' },
      { text: 'Dropped', value: 'dropped' }
    ];
    MAIN_BUTTON_OPTIONS = MAIN_BUTTON_OPTIONS.filter((item) => {
      return item.if ? item.if(media.type) : true;
    });

    let mainButtonTitle = 'Add to library';
    if (libraryEntry) {
      MAIN_BUTTON_OPTIONS.push({ text: 'Remove', value: 'remove' });

      const entry = MAIN_BUTTON_OPTIONS.find(item => item.value === libraryEntry.status);
      mainButtonTitle = (entry && entry.text) || mainButtonTitle;
    }
    MAIN_BUTTON_OPTIONS.push('Nevermind');

    const MORE_BUTTON_OPTIONS = ['Nevermind'];
    if (favorite) {
      MORE_BUTTON_OPTIONS.unshift({ text: 'Remove from Favorites', value: 'remove' });
    } else {
      MORE_BUTTON_OPTIONS.unshift({ text: 'Add to Favorites', value: 'add' });
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
            type={capitalize(media.type)}
            title={media.canonicalTitle}
            description={media.synopsis}
            coverImage={media.coverImage && media.coverImage.original}
            posterImage={media.posterImage && media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            categories={media.categories}
            mainButtonTitle={mainButtonTitle}
            mainButtonOptions={MAIN_BUTTON_OPTIONS}
            mainButtonLoading={loadingLibrary}
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
            navigation={this.props.navigation}
            loadingAdditional={loadingAdditional}
          />
        </ParallaxScroll>
      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export default connect(mapStateToProps)(MediaPages);
