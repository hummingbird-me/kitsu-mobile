import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions, fetchMediaCastings } from 'kitsu/store/media/actions';
import { ScrollableSection } from 'kitsu/screens/Profiles/components/ScrollableSection';
import { ScrollItem } from 'kitsu/screens/Profiles/components/ScrollItem';
import { SceneContainer } from 'kitsu/screens/Profiles/components/SceneContainer';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { ReactionBox } from 'kitsu/screens/Profiles/components/ReactionBox';

class Summary extends Component {
  static propTypes = {
    castings: PropTypes.array.isRequired,
    media: PropTypes.object.isRequired,
    reactions: PropTypes.array.isRequired,

    fetchMediaReactions: PropTypes.func.isRequired,
    fetchMediaCastings: PropTypes.func.isRequired,
    fetchMedia: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired,
  }

  static defaultProps = {
    media: {},
  }

  componentDidMount() {
    const mediaId = 12;
    const type = 'anime';
    this.props.fetchMediaReactions(mediaId, type);
    this.props.fetchMediaCastings(mediaId);
    this.props.fetchMedia(mediaId, type);
  }

  navigateTo = (scene) => {
    this.props.setActiveTab(scene);
  }

  formatData(data, numberOfItems = 12) {
    if (!data) return [];

    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  render() {
    const { media, castings, reactions } = this.props;
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
          titleLabel="Write reactions"
          titleAction={() => {}}
          onViewAllPress={() => this.navigateTo('Reactions')}
          data={this.formatData(reactions)}
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
          data={this.formatData(castings)}
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

const mapStateToProps = (state) => {
  const { media, reactions, castings } = state.media;

  const mediaId = 12;

  return {
    media: media[mediaId],
    reactions: reactions[mediaId] || [],
    castings: castings[mediaId] || [],
  };
};

export default connect(mapStateToProps, {
  fetchMedia,
  fetchMediaReactions,
  fetchMediaCastings,
})(Summary);
