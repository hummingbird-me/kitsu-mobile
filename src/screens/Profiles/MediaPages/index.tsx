import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import { capitalize, isEmpty, isNull, upperFirst } from 'lodash';
import React, { PureComponent } from 'react';
import { Share, StatusBar, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';

import { SceneLoader } from 'kitsu/components/SceneLoader';
import { Kitsu } from 'kitsu/config/api';
import { kitsuConfig } from 'kitsu/config/env';
// TODO: Maybe replace this with const { statusBarHeight, topBarHeight } = await Navigation.constants()
import {
  defaultCover,
  navigationBarHeight,
  statusBarHeight,
} from 'kitsu/constants/app';
import { listBackPurple } from 'kitsu/constants/colors';
import { NavigationActions, Screens } from 'kitsu/navigation';
import {
  Episodes,
  Franchise,
  Reactions,
  Summary,
} from 'kitsu/screens/Profiles/MediaPages/pages';
import { CustomHeader } from 'kitsu/screens/Profiles/components/CustomHeader';
import { ErrorPage } from 'kitsu/screens/Profiles/components/ErrorPage';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneHeader } from 'kitsu/screens/Profiles/components/SceneHeader';
import { TabBar, TabBarLink } from 'kitsu/screens/Profiles/components/TabBar';
import { coverImageHeight, scene } from 'kitsu/screens/Profiles/constants';
import { showCategoryResults } from 'kitsu/screens/Search/SearchNavigationHelper';
import { getImgixCoverImage } from 'kitsu/utils/imgix';
import { isX, paddingX } from 'kitsu/utils/isX';
import {
  KitsuLibrary,
  KitsuLibraryEventSource,
  KitsuLibraryEvents,
} from 'kitsu/utils/kitsuLibrary';
import { handleURL } from 'kitsu/utils/url';

const HEADER_HEIGHT =
  statusBarHeight + navigationBarHeight + (isX ? paddingX : 0);

const TAB_ITEMS = [
  { key: 'summary', label: 'Summary', screen: Summary },
  {
    key: 'episodes',
    label: 'Episodes',
    screen: Episodes,
    if: (state) => state.media.type === 'anime',
  },
  {
    key: 'chapters',
    label: 'Chapters',
    screen: Episodes,
    if: (state) => state.media.type === 'manga',
  },
  // NOTE: Disabled until we improve char db
  // { key: 'characters', label: 'Characters', screen: 'Characters' },
  { key: 'reactions', label: 'Reactions', screen: Reactions },
  { key: 'franchise', label: 'Franchise', screen: Franchise },
];

const tabs = TAB_ITEMS.map((t) => t.key);

interface MediaPagesProps {
  mediaId: number | string;
  mediaType: string;
  activeTab?: unknown[];
}

class MediaPages extends PureComponent<MediaPagesProps> {
  static defaultProps = {
    activeTab: 'summary',
  };

  constructor(props) {
    super(props);

    // Validate the active tab
    let activeTab = props.activeTab;

    // Make sure that media has the right tabs
    if (props.mediaType === 'anime' && activeTab === 'chapters') {
      activeTab = 'episodes';
    } else if (props.mediaType === 'manga' && activeTab === 'episodes') {
      activeTab = 'chapters';
    }

    // If tab is invalid then show the summary
    if (!tabs.includes(activeTab)) activeTab = 'summary';

    this.state = {
      active: activeTab,
      loading: false, // Check whether basic data is loading
      media: null,
      castings: null,
      mediaReactions: null,
      favorite: null,
      libraryEntry: null,
      loadingLibrary: false, // Check whether we are updating/loading library entry
      loadingAdditional: false, // Check whether episodes & Related are loading
    };
  }

  componentDidMount = () => {
    const { mediaId, mediaType } = this.props;
    this.fetchMedia(mediaType, mediaId);
    this.fetchFavorite(mediaType, mediaId);
    this.fetchLibraryEntry(mediaType, mediaId);
    this.unsubscribeCreate = KitsuLibrary.subscribe(
      KitsuLibraryEvents.LIBRARY_ENTRY_CREATE,
      this.onLibraryEntryCreated
    );
    this.unsubscribeUpdate = KitsuLibrary.subscribe(
      KitsuLibraryEvents.LIBRARY_ENTRY_UPDATE,
      this.onLibraryEntryUpdated
    );
    this.unsubscribeDelete = KitsuLibrary.subscribe(
      KitsuLibraryEvents.LIBRARY_ENTRY_DELETE,
      this.onLibraryEntryDeleted
    );
  };

  componentWillUnmount() {
    this.unsubscribeUpdate();
    this.unsubscribeDelete();
  }

  onMainButtonOptionsSelected = async (option) => {
    const { libraryEntry } = this.state;
    const { mediaType } = this.props;
    switch (option) {
      case 'current':
      case 'planned':
      case 'completed':
      case 'on_hold':
      case 'dropped': {
        const data = { status: option };
        libraryEntry
          ? await this.updateLibraryEntry(data)
          : await this.createLibraryEntry(data);
        break;
      }
      case 'remove':
        this.setState({ loadingLibrary: true });
        await Kitsu.destroy('libraryEntries', libraryEntry.id);
        KitsuLibrary.onLibraryEntryDelete(
          libraryEntry.id,
          mediaType,
          libraryEntry.status,
          KitsuLibraryEventSource.MEDIA_PAGE
        );
        this.setState({ libraryEntry: null, loadingLibrary: false });
        break;
      default:
        console.log('unhandled option selected:', option);
        break;
    }
  };

  onMoreButtonOptionsSelected = async (option) => {
    const { mediaId, mediaType, currentUser } = this.props;
    const { media } = this.state;
    switch (option) {
      case 'add': {
        const record = await Kitsu.create('favorites', {
          item: {
            id: mediaId,
            type: mediaType,
          },
          user: {
            id: currentUser.id,
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
      case 'share': {
        const id = (media && media.slug) || mediaId;
        if (isNull(id) || isNull(mediaType)) return;
        const url = `${kitsuConfig.kitsuUrl}/${mediaType}/${id}`;
        const key = Platform.select({ ios: 'url', android: 'message' });
        Share.share({ [key]: url });
        break;
      }
      case 'cover': {
        if (!media || !media.coverImage) return;
        const coverURL =
          media.coverImage.original ||
          media.coverImage.large ||
          media.coverImage.medium ||
          media.coverImage.small ||
          null;

        if (isEmpty(coverURL)) return;
        NavigationActions.showLightBox([coverURL]);
        break;
      }
      case 'trailer':
        if (!media || !media.youtubeVideoId) return;
        handleURL(`https://www.youtube.com/watch?v=${media.youtubeVideoId}`);
        break;
      default:
        console.log('unhandled option selected:', option);
        break;
    }
  };

  onLibraryEntryCreated = (data) => {
    const { mediaId, mediaType } = this.props;
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
  };

  onLibraryEntryUpdated = (data) => {
    const { id, newEntry } = data;
    const { libraryEntry } = this.state;
    if (!newEntry) return;

    // Only update if we have the same entry
    if (libraryEntry && libraryEntry.id == id) {
      this.setState({ libraryEntry: newEntry });
    }
  };

  onLibraryEntryDeleted = (data) => {
    const { id } = data;
    const { libraryEntry } = this.state;

    // Only update if we have the same entry
    if (libraryEntry && libraryEntry.id == id) {
      this.setState({ libraryEntry: null });
    }
  };

  onEpisodeProgress = async (number) => {
    const { media, libraryEntry } = this.state;
    if (!media) return;

    let changes = {};

    // The media count
    const mediaCount = media.episodeCount || media.chapterCount;

    // If library progress is at 1 and `number` is also 1 then we need to set progress back to 0.
    // This is there incase a user accidentally marks episode 1 as watched and can't go back to progress 0 without going back to their library and editing it there.
    let progress = number;
    if (libraryEntry && libraryEntry.progress === 1 && number === 1)
      progress = 0;

    // Check progress is within the bounds
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
    if (
      libraryStatus &&
      libraryStatus === 'completed' &&
      mediaCount &&
      progress !== mediaCount
    ) {
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
  };

  getSubtitles(media) {
    if (!media) return null;

    // The media sub type
    const type =
      (media.showType && upperFirst(media.showType)) ||
      (media.mangaType && capitalize(media.mangaType)) ||
      '';

    // Date when media started
    const startDate = media.startDate && new Date(media.startDate);
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
    if (tab) {
      this.setState({ active: tab.toLowerCase() });
      if (this.scrollView)
        this.scrollView.scrollTo({ x: 0, y: coverImageHeight, animated: true });
    }
  };

  createLibraryEntry = async (options) => {
    const { mediaId, mediaType } = this.props;
    try {
      this.setState({ loadingLibrary: true });
      const record = await Kitsu.create(
        'libraryEntries',
        {
          ...options,
          [mediaType]: {
            id: mediaId,
            type: mediaType,
          },
          user: {
            id: this.props.currentUser.id,
            type: 'users',
          },
        },
        {
          include: 'anime,manga',
        }
      );
      KitsuLibrary.onLibraryEntryCreate(
        record,
        mediaType,
        KitsuLibraryEventSource.MEDIA_PAGE
      );
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error creating library entry:', err);
      this.setState({ loadingLibrary: false });
    }
  };

  updateLibraryEntry = async (changes) => {
    const { libraryEntry } = this.state;
    const { mediaType } = this.props;
    try {
      this.setState({ loadingLibrary: true });
      const updates = {
        id: libraryEntry.id,
        ...changes,
      };
      const record = await Kitsu.update('libraryEntries', updates);
      KitsuLibrary.onLibraryEntryUpdate(
        libraryEntry,
        record,
        mediaType,
        KitsuLibraryEventSource.MEDIA_PAGE
      );
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error updating library entry:', err);
      this.setState({ loadingLibrary: false });
    }
  };

  goBack = () => Navigation.pop(this.props.componentId);

  navigateToEditEntry = () => {
    const { libraryEntry, media } = this.state;
    const { currentUser } = this.props;
    if (!libraryEntry || !currentUser || !media) return;

    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.LIBRARY_ENTRY_EDIT,
        passProps: {
          libraryEntry,
          libraryStatus: libraryEntry.status,
          libraryType: media.type,
          media,
          canEdit: true,
          ratingSystem: currentUser.ratingSystem,
          updateUserLibraryEntry: async (type, status, updates) => {
            await this.updateLibraryEntry(updates);
          },
        },
      },
    });
  };

  /**
   * Fetch the media information
   */
  fetchMedia = async (type, id) => {
    this.setState({ loading: true, loadingAdditional: true });
    try {
      // Fetch the media with categories
      const includes = ['categories'];
      if (type === 'anime') {
        includes.push('animeProductions.producer,streamingLinks.streamer');
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
  };

  /**
   * Fetch the episodes/chapter and related media types
   * @TODO: Fetch this data properly rather than overwriting media
   */
  fetchEpisodesAndRelated = async (type, id) => {
    try {
      // To make this simple, we'll just refetch the media object with these fields.
      const media = await Kitsu.one(type, id).get({
        include: `mediaRelationships.destination,${
          type === 'anime' ? 'episodes.videos' : 'chapters'
        }`,
      });

      const previousCategories =
        (this.state.media && this.state.media.categories) || null;
      const categories =
        (previousCategories && { categories: previousCategories }) || {};

      const previousProductions =
        (this.state.media && this.state.media.animeProductions) || null;
      const productions =
        (previousProductions && { animeProductions: previousProductions }) ||
        {};

      const previousStreamingLinks =
        (this.state.media && this.state.media.streamingLinks) || null;
      const streamingLinks =
        (previousStreamingLinks && {
          streamingLinks: previousStreamingLinks,
        }) ||
        {};

      // Combine the 2 object that we have
      this.setState({
        media: { ...media, ...categories, ...productions, ...streamingLinks },
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
  };

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
  };

  fetchLibraryEntry = async (type, id) => {
    try {
      this.setState({ loadingLibrary: true });
      const response = await Kitsu.findAll(
        'libraryEntries',
        {
          filter: {
            user_id: this.props.currentUser.id,
            [`${type}_id`]: id,
          },
        },
        {
          include: 'anime,manga',
        }
      );
      const record = response && response[0];
      this.setState({ libraryEntry: record, loadingLibrary: false });
    } catch (err) {
      console.log('Error fetching library entry:', err);
    }
  };

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
            isActive={this.state.active === tabItem.key}
            onPress={() => this.setActiveTab(tabItem.key)}
          />
        );
      })}
    </TabBar>
  );

  renderTabs = () => (
    <View style={{ flex: 1 }}>
      {this.renderTabNav()}
      {TAB_ITEMS.map((tabItem) => {
        // If this tab item is conditional, run the check
        if (tabItem.if && !tabItem.if(this.state)) {
          return null;
        }
        return this.renderTab(tabItem.screen, tabItem.key);
      })}
    </View>
  );

  renderTab = (Component, key) => {
    const {
      castings,
      media,
      mediaReactions,
      libraryEntry,
      loadingLibrary,
      loadingAdditional,
      active,
    } = this.state;

    const { componentId } = this.props;

    // Don't render tabs that are not visible
    if (key !== active) return null;

    const otherProps = {
      libraryEntry,
      mediaReactions,
      castings,
      loadingAdditional,
      loadingLibrary,
      componentId,
    };

    return (
      <Component
        key={key}
        setActiveTab={this.setActiveTab}
        media={media}
        mediaId={media.id}
        onEpisodeProgress={this.onEpisodeProgress}
        onLibraryEditPress={this.navigateToEditEntry}
        {...otherProps}
      />
    );
  };

  render() {
    const { error, loading, media, favorite, libraryEntry, loadingLibrary } =
      this.state;

    if (loading) {
      return (
        <SceneContainer>
          <CustomHeader leftButtonAction={this.goBack} leftButtonTitle="Back" />
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
      {
        text: 'Want to Watch',
        value: 'planned',
        if: (type) => type === 'anime',
      },
      {
        text: 'Want to Read',
        value: 'planned',
        if: (type) => type === 'manga',
      },
      { text: 'Completed', value: 'completed' },
      { text: 'On Hold', value: 'on_hold' },
      { text: 'Dropped', value: 'dropped' },
    ];
    MAIN_BUTTON_OPTIONS = MAIN_BUTTON_OPTIONS.filter((item) =>
      item.if ? item.if(media.type) : true
    );

    let mainButtonTitle = 'Add to Library';
    if (libraryEntry) {
      MAIN_BUTTON_OPTIONS.push({ text: 'Remove', value: 'remove' });

      const entry = MAIN_BUTTON_OPTIONS.find(
        (item) => item.value === libraryEntry.status
      );
      mainButtonTitle = (entry && entry.text) || mainButtonTitle;
    }
    MAIN_BUTTON_OPTIONS.push('Nevermind');

    const MORE_BUTTON_OPTIONS = [
      { text: 'Share Media Link', value: 'share' },
      // Only display if media has a valid cover image
      {
        text: 'View Cover Image',
        value: 'cover',
        if: (m) => !!(m && m.coverImage),
      },
      {
        text: 'View Youtube Trailer',
        value: 'trailer',
        if: (m) => !!(m && m.youtubeVideoId),
      },
      'Nevermind',
    ].filter((item) => (item.if ? item.if(media) : true));

    if (favorite) {
      MORE_BUTTON_OPTIONS.unshift({
        text: 'Remove from Favorites',
        value: 'remove',
      });
    } else {
      MORE_BUTTON_OPTIONS.unshift({ text: 'Add to Favorites', value: 'add' });
    }

    return (
      <SceneContainer>
        <StatusBar barStyle="light-content" />
        <ParallaxScroll
          innerRef={(r) => {
            this.scrollView = r;
          }}
          style={{ flex: 1 }}
          headerHeight={HEADER_HEIGHT}
          isHeaderFixed
          parallaxHeight={coverImageHeight}
          renderParallaxBackground={() => (
            <MaskedImage
              maskedTop
              maskedBottom
              source={{
                uri:
                  getImgixCoverImage(media.coverImage, {
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
            onCategoryPress={(item) => {
              if (media) {
                showCategoryResults(
                  this.props.componentId,
                  media.type,
                  item.title
                );
              }
            }}
            mainButtonTitle={mainButtonTitle}
            mainButtonOptions={MAIN_BUTTON_OPTIONS}
            mainButtonLoading={loadingLibrary}
            moreButtonOptions={MORE_BUTTON_OPTIONS}
            onMainButtonOptionsSelected={this.onMainButtonOptionsSelected}
            onMoreButtonOptionsSelected={this.onMoreButtonOptionsSelected}
          />
          {this.renderTabs()}
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
