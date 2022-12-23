import { isEmpty, uniqBy, upperFirst } from 'lodash';
import React, { PureComponent } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import URL from 'url-parse';

import { Button } from 'kitsu/components/Button';
import { Kitsu } from 'kitsu/config/api';
import { ADMOB_AD_UNITS, STREAMING_SERVICES } from 'kitsu/constants/app';
import { Screens } from 'kitsu/navigation';
import { Post } from 'kitsu/screens/Feed/components/Post';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { MediaDetails } from 'kitsu/screens/Profiles/components/MediaDetails';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import { preprocessFeed } from 'kitsu/utils/preprocessFeed';
import { isAoProOrKitsuPro } from 'kitsu/utils/user';

import { SummaryProgress } from './progress';
import { styles } from './styles';

interface SummaryComponentProps {
  castings?: unknown[];
  currentUser: object;
  media: object;
  mediaReactions?: unknown[];
  componentId: any;
  setActiveTab(...args: unknown[]): unknown;
  loadingAdditional?: boolean;
  libraryEntry?: object;
  onLibraryEditPress?(...args: unknown[]): unknown;
}

class SummaryComponent extends PureComponent<SummaryComponentProps> {
  static defaultProps = {
    castings: null,
    mediaReactions: null,
    loadingAdditional: false,
    libraryEntry: null,
    onLibraryEditPress: null,
  };

  state = {
    feed: [],
    loadingFeed: true,
    loadingNextFeed: false,
  };

  componentDidMount() {
    this.fetchFeed({ reset: true });
  }

  formatData(data, numberOfItems = 12) {
    if (!data) return [];
    return data.sort((a, b) => a.number - b.number).slice(0, numberOfItems);
  }

  canFetchNextFeed = true;
  feedCursor = undefined;
  fetchFeed = async ({ reset = false } = {}) => {
    const { type, id } = this.props.media;
    const endpoint = type.charAt(0).toUpperCase() + type.slice(1);

    if (reset) {
      this.canFetchNextFeed = true;
      this.feedCursor = undefined;
      this.setState({ loadingFeed: true });
    } else if (this.canFetchNextFeed) {
      this.setState({ loadingNextFeed: true });
    }

    let data = [];
    try {
      const result = await Kitsu.one('mediaFeed', `${endpoint}-${id}`).get({
        include:
          'media,actor,unit,subject,target,target.user,target.target_user,target.spoiled_unit,target.media,target.target_group,subject.user,subject.target_user,subject.spoiled_unit,subject.media,subject.target_group,subject.followed,subject.library_entry,subject.anime,subject.manga,subject.uploads,target.uploads',
        filter: {
          kind: 'posts',
        },
        page: {
          cursor: this.feedCursor,
          limit: 10,
        },
      });

      // I need to read the cursor value out of the 'next' link in the result.
      this.canFetchNextFeed = !isEmpty(
        result && result.links && result.links.next
      );
      const url = new URL(result.links.next, true);
      this.feedCursor = url.query['page[cursor]'];

      // Filter out non-post activities
      const feed = preprocessFeed(result).filter((i) => i.type === 'posts');
      data = reset ? [...feed] : [...this.state.feed, ...feed];
      data = uniqBy(data, 'id');
    } catch (error) {
      console.log(error);
      data = [];
    } finally {
      this.setState({
        feed: data,
        loadingFeed: false,
        loadingNextFeed: false,
      });
    }
  };

  navigateTo = (scene) => this.props.setActiveTab(scene);

  navigateToPost = (props) =>
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.FEED_POST_DETAILS,
        passProps: props,
      },
    });

  navigateToUserProfile = (userId) =>
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.PROFILE_PAGE,
        passProps: { userId },
      },
    });

  navigateToMedia = (mediaType, mediaId) =>
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: { mediaId, mediaType },
      },
    });

  navigateToUnitPage = (unit, media) =>
    Navigation.push(this.props.componentId, {
      component: {
        name: Screens.MEDIA_UNIT_DETAIL,
        passProps: { unit, media },
      },
    });

  renderItem = ({ item, index }) => (
    <React.Fragment>
      <Post
        post={item}
        onPostPress={this.navigateToPost}
        currentUser={this.props.currentUser}
        navigateToUserProfile={(userId) => this.navigateToUserProfile(userId)}
        componentId={this.props.componentId}
      />
      {/* Render a AdMobBanner every 3 posts */}
      {(index + 1) % 3 === 0 && this.renderAdBanner(10)}
    </React.Fragment>
  );

  renderEpisodes = (media) => {
    const { loadingAdditional } = this.props;

    // We only want to show episodes and not chapters
    if (!media || media.type !== 'anime') return null;

    // Filter out episodes that have videos associated with them
    const episodesWithVideos = (media.episodes || []).filter(
      (e) => !isEmpty(e.videos)
    );
    const episodeSuffix = media.episodeCount ? `of ${media.episodeCount}` : '';

    // We want to show the loading indicator to the user
    // But once that is done and we don't have any episodes then we just don't render anything
    if (!loadingAdditional && isEmpty(episodesWithVideos)) return null;

    return (
      <ScrollableSection
        title="Episodes"
        onViewAllPress={() => this.navigateTo('episodes')}
        data={this.formatData(episodesWithVideos)}
        loading={loadingAdditional}
        renderItem={({ item }) => (
          <ScrollItem>
            <ImageCard
              subtitle={`Ep. ${item.number} ${episodeSuffix}`}
              title={item.canonicalTitle}
              variant="landscapeLarge"
              source={{
                uri:
                  (item.thumbnail && item.thumbnail.original) ||
                  (media.posterImage && media.posterImage.medium),
              }}
              onPress={() => this.navigateToUnitPage(item, media)}
            />
          </ScrollItem>
        )}
      />
    );
  };

  renderStreamingLinks = (media) => {
    if (!media || media.type !== 'anime' || isEmpty(media.streamingLinks))
      return null;

    // Only show the streaming links that we have images for
    const filtered = media.streamingLinks
      .filter((link) => {
        const name = link.streamer && link.streamer.siteName;
        return (
          name && Object.keys(STREAMING_SERVICES).includes(name.toLowerCase())
        );
      })
      .sort((a, b) => a.streamer.siteName.localeCompare(b.streamer.siteName));

    return (
      <FlatList
        data={filtered}
        keyExtractor={(i) => `${i.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.streamingLinksContent}
        renderItem={({ item }) => (
          <ScrollItem spacing={scenePadding / 2}>
            <ImageCard
              variant="landscapeSmall"
              source={
                item.streamer &&
                STREAMING_SERVICES[item.streamer.siteName.toLowerCase()]
              }
              onPress={() => {
                if (!isEmpty(item.url)) {
                  Linking.openURL(item.url);
                }
              }}
            />
          </ScrollItem>
        )}
        style={styles.streamingLinks}
      />
    );
  };

  renderAdBanner = (margin) => {
    /*
    if (isAoProOrKitsuPro(this.props.currentUser)) {*/
    return null;
    /*}
    return (
      <React.Fragment>
        <View style={{ marginTop: margin }} />
        <AdMobBanner
          adUnitID={ADMOB_AD_UNITS[Platform.OS]}
          adSize="smartBannerPortrait"
          testDevices={[AdMobBanner.simulatorId]}
          onAdFailedToLoad={error => console.log(error)}
        />
      </React.Fragment>
    );*/
  };

  render() {
    const {
      media,
      castings,
      mediaReactions,
      loadingAdditional,
      libraryEntry,
      onLibraryEditPress,
    } = this.props;
    const { loadingFeed, loadingNextFeed, feed } = this.state;

    return (
      <SceneContainer>
        {/* Banner */}
        {this.renderAdBanner(15)}

        {/* Progress */}
        <SummaryProgress
          libraryEntry={libraryEntry}
          media={media}
          onPress={() => this.navigateTo('episodes')}
          onEditPress={onLibraryEditPress}
        />

        {/* Streaming Links */}
        {this.renderStreamingLinks(media)}

        {/* Episodes */}
        {this.renderEpisodes(media)}

        {/* Details */}
        <MediaDetails media={media} />

        {/* Banner */}
        {this.renderAdBanner(15)}

        {/* Reactions */}
        {/* @TODO: Reactions Empty State - Render nothing until we support writing */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('reactions')}
          data={mediaReactions}
          loading={loadingAdditional}
          renderItem={({ item }) => (
            <ScrollItem>
              <ReactionBox
                boxed
                reactedMedia={media.canonicalTitle}
                reaction={item}
              />
            </ScrollItem>
          )}
        />

        {/* Related Media */}
        <ScrollableSection
          contentDark
          title="More from this series"
          onViewAllPress={() => this.navigateTo('franchise')}
          data={this.formatData(media.mediaRelationships)}
          loading={loadingAdditional}
          renderItem={({ item }) => {
            const destination = item.destination;
            if (!destination) return null;

            const subheading =
              destination.type === 'anime'
                ? destination.showType
                : destination.mangaType;

            return (
              <ScrollItem spacing={4}>
                <ImageCard
                  centerTitle
                  boldTitle={false}
                  variant="portraitLarge"
                  title={destination.canonicalTitle}
                  subheading={upperFirst(subheading)}
                  source={{
                    uri:
                      destination.posterImage &&
                      destination.posterImage.original,
                  }}
                  onPress={() =>
                    this.navigateToMedia(destination.type, destination.id)
                  }
                />
              </ScrollItem>
            );
          }}
        />

        {/* Characters */}
        {/* Disabled for now until we fix up our character db */}
        {/* <ScrollableSection
          contentDark
          title="Characters"
          onViewAllPress={() => this.navigateTo('characters')}
          data={castings}
          loading={isNull(castings)}
          renderItem={({ item }) => (
            <ScrollItem spacing={4}>
              <ImageCard
                centerTitle
                boldTitle={false}
                variant="portrait"
                title={item.character.name}
                source={{
                  uri: item.character.image && item.character.image.original,
                }}
              />
            </ScrollItem>
          )}
        /> */}

        {/* Feed */}
        {loadingFeed ? (
          <ActivityIndicator color="white" style={styles.loading} />
        ) : (
          <React.Fragment>
            <FlatList
              data={feed || []}
              keyExtractor={(item) => `${item.id}`}
              renderItem={this.renderItem}
            />
            {/* @Temporary - Load more button */}
            {this.canFetchNextFeed && (
              <Button
                style={styles.loadFeedButton}
                title="Load More"
                onPress={() => {
                  this.fetchFeed();
                }}
                loading={loadingNextFeed}
              />
            )}
          </React.Fragment>
        )}
      </SceneContainer>
    );
  }
}

const mapStateToProps = ({ user }) => {
  const { currentUser } = user;
  return { currentUser };
};

export const component = connect(mapStateToProps)(SummaryComponent);
