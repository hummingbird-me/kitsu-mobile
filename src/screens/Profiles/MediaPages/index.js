import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View } from 'react-native';
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
import { coverImageHeight, scene } from 'kitsu/screens/Profiles/constants';
import { isX, paddingX } from 'kitsu/utils/isX';
import { capitalize, upperFirst } from 'lodash';
import { getImgixCoverImage } from 'kitsu/utils/coverImage';
import { StyledText } from 'kitsu/components/StyledText';
import { KitsuLibrary, KitsuLibraryEvents, KitsuLibraryEventSource } from 'kitsu/utils/kitsuLibrary';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';

const HEADER_HEIGHT = navigationBarHeight + statusBarHeight + (isX ? paddingX : 0);
const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: 'Summary' },
  { key: 'episodes', label: 'Episodes', screen: 'Episodes', if: (state) => state.media.type === 'anime'},
  { key: 'chapters', label: 'Chapters', screen: 'Episodes', if: (state) => state.media.type === 'manga'},
  // NOTE: Disabled until we improve char db
  // { key: 'characters', label: 'Characters', screen: 'Characters' },
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
    loadingLibrary: false, // Check whether we are updating/loading library entry
    loadingAdditional: false, // Check whether episodes & Related are loading
  }

  componentDidMount = () => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    this.fetchMedia(mediaType, mediaId);
    this.fetchFavorite(mediaType, mediaId);
    this.fetchLibraryEntry(mediaType, mediaId);
    this.unsubscribeCreate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_CREATE, this.onLibraryEntryCreated);
    this.unsubscribeUpdate = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE, this.onLibraryEntryUpdated);
    this.unsubscribeDelete = KitsuLibrary.subscribe(KitsuLibraryEvents.LIBRARY_ENTRY_DELETE, this.onLibraryEntryDeleted);
  }

  componentWillUnmount() {
    this.unsubscribeUpdate();
    this.unsubscribeDelete();
  }

  onMainButtonOptionsSelected = async (option) => {
    const { libraryEntry } = this.state;
    const { mediaType } = this.props.navigation.state.params;
    switch (option) {
      case 'current':
      case 'planned':
      case 'completed':
      case 'on_hold':
      case 'dropped': {
        const data = { status: option };
        libraryEntry ? await this.updateLibraryEntry(data) : await this.createLibraryEntry(data);
        break;
      }
      case 'remove':
        this.setState({ loadingLibrary: true });
        await Kitsu.destroy('libraryEntries', libraryEntry.id);
        KitsuLibrary.onLibraryEntryDelete(libraryEntry.id, mediaType, libraryEntry.status, KitsuLibraryEventSource.MEDIA_PAGE);
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
      case 'add': {
        const record = await Kitsu.create('favorites', {
          item: {
            id: mediaId,
            type: mediaType,
          },
          user: {
            id: this.props.currentUser.id,
            type: 'users',
          },
        });
        this.setState({ favorite: record });
        break;
      }
      case 'remove':
        await Kitsu.destroy('favorites', this.state.favorite.id);
        this.setState({ favorite: null });
        break;
      default:
        console.log('unhandled option selected:', option);
        break;
    }
  }

  onLibraryEntryCreated = (data) => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    const { type, entry } = data;
    const { libraryEntry } = this.state;

    // Don't continue if we already have an entry
    // Or if the types don't match
    if (libraryEntry || !entry || mediaType !== type) return;

    // If the entry has the same media id as this page then add it
    const media = entry[type];
    if (media && media.id == mediaId) {
      this.setState({ libraryEntry: entry });
    }
  }

  onLibraryEntryUpdated = (data) => {
    const { id, newEntry } = data;
    const { libraryEntry } = this.state;
    if (!newEntry) return;

    // Only update if we have the same entry
    if (libraryEntry && libraryEntry.id == id) {
      this.setState({ libraryEntry: newEntry });
    }
  }

  onLibraryEntryDeleted = (data) => {
    const { id } = data;
    const { libraryEntry } = this.state;

    // Only update if we have the same entry
    if (libraryEntry && libraryEntry.id == id) {
      this.setState({ libraryEntry: null });
    }
  }

  onEpisodeProgress = async (number) => {
    const { media, libraryEntry } = this.state;
    if (!media) return;

    let changes = {};

    // The media count
    const mediaCount = media.episodeCount || media.chapterCount;

    // Check progress is within the bounds
    let progress = number;
    if (progress < 0) progress = 0;
    if (mediaCount && progress > mediaCount) {
      progress = mediaCount;
    }
    changes = { ...changes, progress };

    // Mark entry as completed if the the progress is the same as the count.
    const libraryStatus = libraryEntry && libraryEntry.status;
    let status = libraryStatus || 'current';
    if (mediaCount && progress === mediaCount) {
      // Check if we were reconsuming, if so increase the count
      if (libraryEntry && libraryEntry.reconsuming) {
        const reconsumeCount = libraryEntry.reconsumeCount + 1;
        changes = { ...changes, reconsuming: false, reconsumeCount };
      }

      // Set the status to complete
      status = 'completed';
    }

    // If entry was 'planned' and we progressed then move it to current
    if (libraryStatus && libraryStatus === 'planned') {
      status = 'current';
    }

    // If entry was 'completed' and we progressed then set reconsuming to true
    if (libraryStatus && libraryStatus === 'completed' && mediaCount && progress !== mediaCount) {
      changes = { ...changes, reconsuming: true };
    }

    // Set the new status
    changes = { ...changes, status };


    // Now we just call the relevant method
    // Could have the case where user taps progress but doesn't have an entry
    if (!libraryEntry) {
      await this.createLibraryEntry(changes);
    } else {
      await this.updateLibraryEntry(changes);
    }
  }

  getSubtitles(media) {
    if (!media) return null;

    // The media sub type
    const type = (media.showType && upperFirst(media.showType)) ||
      (media.mangaType && capitalize(media.mangaType)) ||
      '';

    // Date when media started
    const startDate = media.startDate && (new Date(media.startDate));
    const year = (startDate && startDate.getFullYear().toString()) || null;

    // Episode or chapter counts
    const countSuffix = media.type === 'anime' ? 'Eps' : 'Chs';
    const count = media.episodeCount || media.chapterCount || null;
    const countString = count && `${count} ${countSuffix}`;

    // Finished status
    const status = media.status === 'finished' ? 'Finished' : null;

    return [type, year, status, countString];
  }

  setActiveTab = (tab) => {
    this.setState({ active: tab });
  }

  createLibraryEntry = async (options) => {
    const { mediaId, mediaType } = this.props.navigation.state.params;
    try {
      this.setState({ loadingLibrary: true });
      const record = await Kitsu.create('libraryEntries', {
        ...options,
        [mediaType]: {
          id: mediaId,
          type: mediaType
        },
        user: {
          id: this.props.currentUser.id,
          type: 'users',
        },
      }, {
        include: 'anime,manga',
      });
      KitsuLibrary.onLibraryEntryCreate(record, mediaType, KitsuLibraryEventSource.MEDIA_PAGE);
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error creating library entry:', err);
      this.setState({ loadingLibrary: false });
    }
  }

  updateLibraryEntry = async (changes) => {
    const { libraryEntry } = this.state;
    const { mediaType } = this.props.navigation.state.params;
    try {
      this.setState({ loadingLibrary: true });
      const updates = {
        id: libraryEntry.id,
        ...changes,
      };
      const record = await Kitsu.update('libraryEntries', updates);
      KitsuLibrary.onLibraryEntryUpdate(libraryEntry, record, mediaType, KitsuLibraryEventSource.MEDIA_PAGE);
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error updating library entry:', err);
      this.setState({ loadingLibrary: false });
    }
  }

  goBack = () => this.props.navigation.goBack();

  navigateToEditEntry = () => {
    const { libraryEntry, media } = this.state;
    const { currentUser, navigation } = this.props;
    if (!libraryEntry || !currentUser || !media) return;

    // We need to combine the media with the entry
    const entryWithMedia = {
      ...libraryEntry,
      [media.type]: media,
    };

    navigation.navigate('UserLibraryEdit', {
      libraryEntry: entryWithMedia,
      libraryStatus: entryWithMedia.status,
      libraryType: media.type,
      canEdit: true,
      ratingSystem: currentUser.ratingSystem,
      updateUserLibraryEntry: async (type, status, updates) => {
        await this.updateLibraryEntry(updates);
      },
    });
  }

  /**
   * Fetch the media information
   */
  fetchMedia = async (type, id) => {
    this.setState({ loading: true, loadingAdditional: true });
    try {
      // Fetch the media with categories
      const includes = ['categories'];
      if (type === 'anime') {
        includes.push('animeProductions.producer');
      }
      const media = await Kitsu.one(type, id).get({
        include: includes.join(),
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
   * @TODO: Fetch this data properly rather than overwriting media
   */
  fetchEpisodesAndRelated = async (type, id) => {
    try {
      // To make this simple, we'll just refetch the media object with these fields.
      const media = await Kitsu.one(type, id).get({
        include: `mediaRelationships.destination,${type === 'anime' ? 'episodes' : 'chapters'}`,
      });

      const previousCategories = (this.state.media && this.state.media.categories) || null;
      const categories = (previousCategories && { categories: previousCategories }) || {};

      const previousProductions = (this.state.media && this.state.media.animeProductions) || null;
      const productions = (previousProductions && { animeProductions: previousProductions }) || {};

      // Combine the 2 object that we have
      this.setState({
        media: { ...media, ...categories, ...productions },
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
        // castings,
        mediaReactions,
      ] = await Promise.all([
        /** Disabled until we improve our character db.
        Kitsu.findAll('castings', {
          filter: {
            mediaId: id,
            mediaType: capitalize(type),
            isCharacter: true,
          },
          sort: '-featured',
          include: 'character',
        }),
        */
        Kitsu.findAll('mediaReactions', {
          filter: {
            [`${type}Id`]: id,
          },
          include: 'user',
          sort: '-upVotesCount',
        }),
      ]);

      this.setState({
        // castings,
        mediaReactions,
        loadingAdditional: false,
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
          user_id: this.props.currentUser.id,
        },
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
          [`${type}_id`]: id,
        },
      }, {
        include: 'anime,manga',
      });
      const record = response && response[0];
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error fetching library entry:', err);
    }
  }

  renderTabNav = () => (
    <TabBar>
      {TAB_ITEMS.map((tabItem) => {
        // If this tab item is conditional, run the check
        if (tabItem.if && !tabItem.if(this.state)) {
          return null;
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
      return <ErrorPage onBackPress={this.goBack} />;
    }

    // Handle dynamic button options (TODO: Cleanup)
    let MAIN_BUTTON_OPTIONS = [
      { text: 'Watching', value: 'current', if: (type) => type === 'anime' },
      { text: 'Reading', value: 'current', if: (type) => type === 'manga' },
      { text: 'Want to Watch', value: 'planned', if: (type) => type === 'anime' },
      { text: 'Want to Read', value: 'planned', if: (type) => type === 'manga' },
      { text: 'Completed', value: 'completed' },
      { text: 'On Hold', value: 'on_hold' },
      { text: 'Dropped', value: 'dropped' }
    ];
    MAIN_BUTTON_OPTIONS = MAIN_BUTTON_OPTIONS.filter((item) => {
      return item.if ? item.if(media.type) : true;
    });

    let mainButtonTitle = 'Add to Library';
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
              source={{
                uri: getImgixCoverImage(media.coverImage, {
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
            variant="media"
            media={media}
            title={media.canonicalTitle}
            subtitle={this.getSubtitles(media)}
            description={media.synopsis}
            posterImage={media.posterImage && media.posterImage.large}
            popularityRank={media.popularityRank}
            ratingRank={media.ratingRank}
            averageRating={parseFloat(media.averageRating) || null}
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
            libraryEntry={libraryEntry}
            mediaReactions={mediaReactions}
            castings={castings}
            navigation={this.props.navigation}
            loadingAdditional={loadingAdditional}
            loadingLibrary={loadingLibrary}
            onEpisodeProgress={this.onEpisodeProgress}
            onLibraryEditPress={this.navigateToEditEntry}
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
