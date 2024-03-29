import { isEmpty } from 'lodash';
import capitalize from 'lodash/capitalize';
import React, { PureComponent } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { Rating } from 'kitsu/components/Rating';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { StyledText } from 'kitsu/components/StyledText';
import { Screens } from 'kitsu/navigation';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { UserStats } from 'kitsu/screens/Profiles/components/UserStats';
import { isIdForCurrentUser } from 'kitsu/utils/id';

interface SummaryProps {
  setActiveTab?(...args: unknown[]): unknown;
  userId: number;
  componentId: any;
  currentUser: object;
  loadingLibraryActivity?: boolean;
  libraryActivity?: object[];
  loadingReactions?: boolean;
  reactions?: object[];
  loadingStats?: boolean;
  stats?: object[];
}

export default class Summary extends PureComponent<SummaryProps> {
  static defaultProps = {
    setActiveTab: null,
    loadingLibraryActivity: false,
    libraryActivity: [],
    loadingReactions: false,
    reactions: [],
    loadingStats: false,
    stats: [],
  };

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  };

  navigateToMedia = (media) => {
    if (media) {
      Navigation.push(this.props.componentId, {
        component: {
          name: Screens.MEDIA_PAGE,
          passProps: {
            mediaId: media.id,
            mediaType: media.type,
          },
        },
      });
    }
  };

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  renderLibraryActivity = (item) => {
    const entry = item.libraryEntry;
    if (isEmpty(entry)) return <View />;

    let caption = '';
    const data = item.changedData;
    const rating = (data && data.rating && data.rating[1]) || entry.rating;

    if (data) {
      if (data.status && data.status.length > 1) {
        caption = `${capitalize(data.status[1].replace('_', ' '))}`;
      } else if (data.progress && data.progress.length > 1) {
        caption = `${
          entry.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'
        } ${data.progress[1]}`;
      }
    }

    return (
      <ScrollItem>
        <TouchableOpacity onPress={() => this.navigateToMedia(entry.media)}>
          <ImageCard
            noMask
            variant="portraitLarge"
            source={{
              uri: entry.media.posterImage && entry.media.posterImage.original,
            }}
          />
          <View style={{ alignItems: 'center', marginTop: 3 }}>
            {item.kind === 'rated' ? (
              <Rating
                disabled
                ratingTwenty={rating}
                ratingSystem={this.props.currentUser.ratingSystem}
                size="tiny"
                viewType="single"
                showNotRated={false}
              />
            ) : (
              <StyledText size="xxsmall" color="dark">
                {caption}
              </StyledText>
            )}
          </View>
        </TouchableOpacity>
      </ScrollItem>
    );
  };

  render() {
    const {
      loadingLibraryActivity,
      libraryActivity,
      loadingReactions,
      reactions,
      loadingStats,
      stats,
    } = this.props;
    if (loadingLibraryActivity) return <SceneLoader />;

    const isCurrentUser = isIdForCurrentUser(
      this.props.userId,
      this.props.currentUser
    );
    // Normalize stats
    const normalizedStats = stats
      ? stats.reduce((acc, stat) => {
          return { ...acc, [stat.kind]: stat };
        }, {})
      : null;

    return (
      <SceneContainer>
        {/* Library Activity */}
        <ScrollableSection
          contentDark
          title="Library activity"
          onViewAllPress={() => this.navigateTo('library')}
          data={libraryActivity}
          renderItem={({ item }) => this.renderLibraryActivity(item)}
        />

        {/* Reactions */}
        {/* @TODO: Empty state when userReactions != null && empty */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('reactions')}
          data={reactions}
          loading={loadingReactions}
          renderItem={({ item }) => {
            const title =
              (item.anime && item.anime.canonicalTitle) ||
              (item.manga && item.manga.canonicalTitle) ||
              '-';
            return (
              <ScrollItem>
                <ReactionBox boxed reactedMedia={title} reaction={item} />
              </ScrollItem>
            );
          }}
        />

        {/* Stats */}
        {normalizedStats && (
          <React.Fragment>
            <UserStats
              kind="anime"
              data={normalizedStats}
              loading={loadingStats}
              isCurrentUser={isCurrentUser}
            />
            <UserStats
              kind="manga"
              data={normalizedStats}
              loading={loadingStats}
              isCurrentUser={isCurrentUser}
            />
          </React.Fragment>
        )}
      </SceneContainer>
    );
  }
}
