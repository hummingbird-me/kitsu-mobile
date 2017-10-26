import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import capitalize from 'lodash/capitalize';

import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { StyledText } from 'kitsu/components/StyledText';

// TODO: Note I shouldn't be needed once we can pass params with React Navigation properly.
// https://github.com/react-community/react-navigation/issues/143
// import { requests } from 'kitsu/screens/Profiles/MediaPages';

export default class Summary extends PureComponent {
  static propTypes = {
    setActiveTab: PropTypes.func,
    userId: PropTypes.number.isRequired,
    navigation: PropTypes.object.isRequired,
  }

  static defaultProps = {
    setActiveTab: null,
    loading: true,
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const { userId } = this.props;

    try {
      const library = await Kitsu.findAll('libraryEntries', {
        fields: {
          anime: 'slug,posterImage,canonicalTitle,titles,synopsis,subtype,startDate,status,averageRating,popularityRank,ratingRank,episodeCount',
          users: 'id',
        },
        filter: {
          userId,
          kind: 'anime',
        },
        include: 'anime,user,mediaReaction',
        page: {
          // TODO: Connect pagination with flat list
          offset: 0,
          limit: 40,
        },
        sort: 'status,-progressed_at',
      });

      this.setState({
        loading: false,
        library,
      });
    } catch (error) {
      console.log('Error while fetching library entries: ', err);

      this.setState({
        loading: false,
        error,
      });
    }
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  navigateToMedia = (media, profileName) => {
    this.props.navigation.navigate('MediaPages', {
      mediaId: media.id,
      mediaType: media.type,
      profileName,
    });
  }

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  render() {
    const { loading, error, library } = this.props;

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
        {/* Library Activity */}
        <ScrollableSection
          contentDark
          title="Library activity"
          onViewAllPress={() => this.navigateTo('Library')}
          data={library}
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
                  onPress={() => this.navigateToMedia(
                    item.activities[0].media,
                    this.props.profile.name,
                  )}
                >
                  <ImageCard
                    noMask
                    variant="portraitLarge"
                    source={{
                      uri: activity.media.posterImage && activity.media.posterImage.original,
                    }}
                  />
                  <View style={{ alignItems: 'center', marginTop: 3 }}>
                    <StyledText size="xxsmall">{caption}</StyledText>
                  </View>
                </TouchableOpacity>
              </ScrollItem>
            );
          }}
        />

        {/* Reactions */}
        {/* Todo KB: get real data */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                subtitle="Ep. 1 of 12"
                title={item.canonicalTitle}
                variant="landscapeLarge"
                source={{
                  uri:
                    (item.thumbnail && item.thumbnail.original) ||
                    (media.posterImage && media.posterImage.large),
                }}
              />
            </ScrollItem>
          )}
        />
      </SceneContainer>
    );
  }
}
