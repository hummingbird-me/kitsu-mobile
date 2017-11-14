import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';

export class Summary extends PureComponent {
  static propTypes = {
    castings: PropTypes.array.isRequired,
    media: PropTypes.object.isRequired,
    mediaReactions: PropTypes.array.isRequired,

    setActiveTab: PropTypes.func.isRequired,
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  formatData(data, numberOfItems = 12) {
    if (!data) return [];

    return data.sort((a, b) => a.number - b.number).slice(0, numberOfItems);
  }

  render() {
    const { media, castings, mediaReactions } = this.props;
    const series = media.type === 'anime' ? media.episodes || [] : media.chapters || [];
    const seriesCount = series.length;

    return (
      <SceneContainer>
        {/* Episodes */}
        <ScrollableSection
          title={`Episodes・${seriesCount}`}
          onViewAllPress={() => this.navigateTo('Episodes')}
          data={this.formatData(series)}
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

        {/* Related Media */}
        <ScrollableSection
          contentDark
          title="More from this series"
          data={this.formatData(media.mediaRelationships)}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                variant="portraitLarge"
                title={item.destination.canonicalTitle}
                source={{
                  uri: item.destination.posterImage && item.destination.posterImage.original,
                }}
              />
            </ScrollItem>
          )}
        />

        {/* Reactions */}
        <ScrollableSection
          title="Reactions"
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={mediaReactions}
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

        {/* Characters */}
        <ScrollableSection
          contentDark
          title="Characters"
          onViewAllPress={() => this.navigateTo('Characters')}
          data={castings}
          renderItem={({ item }) => (
            <ScrollItem>
              <ImageCard
                variant="portrait"
                title={item.character.name}
                source={{
                  uri: item.character.image && item.character.image.original,
                }}
              />
            </ScrollItem>
          )}
        />

      </SceneContainer>
    );
  }
}
