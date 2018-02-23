import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { isNull, isEmpty } from 'lodash';
import capitalize from 'lodash/capitalize';

import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { StyledText } from 'kitsu/components/StyledText';
import { Rating } from 'kitsu/components/Rating';

export default class Summary extends PureComponent {
  static propTypes = {
    setActiveTab: PropTypes.func,
    userId: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    setActiveTab: null,
  }

  state = {
    loading: true,
    libraryActivity: null,
    error: null,
    userReactions: null,
  }

  componentDidMount() {
    this.loadLibraryActivity();
    this.loadReactions();
  }

  loadLibraryActivity = async () => {
    const { userId } = this.props;

    try {
      const libraryActivity = await Kitsu.findAll('libraryEvents', {
        page: { limit: 20 },
        filter: { userId },
        sort: '-createdAt',
        include: 'libraryEntry.media',
      });

      this.setState({
        loading: false,
        libraryActivity,
      });
    } catch (error) {
      console.log('Error while fetching library entries: ', error);

      this.setState({
        loading: false,
        error,
      });
    }
  }

  loadReactions = async () => {
    const { userId } = this.props;
    try {
      const reactions = await Kitsu.findAll('mediaReactions', {
        filter: { userId },
        include: 'anime,user,manga',
        sort: 'upVotesCount',
        page: { limit: 5 },
      });
      this.setState({ userReactions: reactions });
    } catch (error) {
      console.log('Error fetching reactions for user:', error);
    }
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  navigateToMedia = (media) => {
    if (media) {
      this.props.navigation.navigate('MediaPages', {
        mediaId: media.id,
        mediaType: media.type,
      });
    }
  }

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
        caption = `${entry.media.type === 'anime' ? 'Watched ep.' : 'Read ch.'} ${data.progress[1]}`;
      }
    }

    return (
      <ScrollItem>
        <TouchableOpacity
          onPress={() => this.navigateToMedia(entry.media)}
        >
          <ImageCard
            noMask
            variant="portraitLarge"
            source={{
              uri: entry.media.posterImage && entry.media.posterImage.original,
            }}
          />
          <View style={{ alignItems: 'center', marginTop: 3 }}>
            {item.kind === 'rated' ?
              <Rating
                disabled
                ratingTwenty={rating}
                ratingSystem={this.props.currentUser.ratingSystem}
                size="tiny"
                viewType="single"
                showNotRated={false}
              />
              :
              <StyledText size="xxsmall" color="dark">{caption}</StyledText>
            }
          </View>
        </TouchableOpacity>
      </ScrollItem>
    );
  }

  render() {
    const { loading, error, libraryActivity, userReactions } = this.state;

    if (loading) return <SceneLoader />;

    if (error) {
      // Return error state
      return null;
    }

    return (
      <SceneContainer>
        {/* Library Activity */}
        <ScrollableSection
          contentDark
          title="Library activity"
          onViewAllPress={() => this.navigateTo('Library')}
          data={libraryActivity}
          renderItem={({ item }) => this.renderLibraryActivity(item)}
        />

        {/* Reactions */}
        {/* @TODO: Empty state when userReactions != null && empty */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={userReactions}
          loading={isNull(userReactions)}
          renderItem={({ item }) => {
            const title =
              (item.anime && item.anime.canonicalTitle) ||
              (item.manga && item.manga.canonicalTitle) || '-';
            return (
              <ScrollItem>
                <ReactionBox
                  boxed
                  reactedMedia={title}
                  reaction={item}
                />
              </ScrollItem>
            );
          }}
        />
      </SceneContainer>
    );
  }
}
