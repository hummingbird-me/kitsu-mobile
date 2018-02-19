import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import { isNull } from 'lodash';
import capitalize from 'lodash/capitalize';

import { Kitsu } from 'kitsu/config/api';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { SceneLoader } from 'kitsu/components/SceneLoader';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';
import { StyledText } from 'kitsu/components/StyledText';

export default class Summary extends PureComponent {
  static propTypes = {
    setActiveTab: PropTypes.func,
    userId: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
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
      const libraryActivity = await Kitsu.one('userFeed', userId).get({
        page: { limit: 40 },
        filter: {
          kind: 'media',
        },
        include: 'media',
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
        page: { limit: 5 }
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
    this.props.navigation.navigate('MediaPages', {
      mediaId: media.id,
      mediaType: media.type,
    });
  }

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
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
                  onPress={() => this.navigateToMedia(item.activities[0].media)}
                >
                  <ImageCard
                    noMask
                    variant="portraitLarge"
                    source={{
                      uri: activity.media.posterImage && activity.media.posterImage.original,
                    }}
                  />
                  <View style={{ alignItems: 'center', marginTop: 3 }}>
                    <StyledText size="xxsmall" color="dark">{caption}</StyledText>
                  </View>
                </TouchableOpacity>
              </ScrollItem>
            );
          }}
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
