import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaReactions, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  SceneContainer,
  EpisodesBox,
  RelatedMediaBox,
  ReactionsBox,
  CharactersBox,
} from '../components';

class Summary extends Component {
  componentDidMount() {
    const mediaId = 12;
    const type = 'anime';
    this.props.fetchMediaReactions(mediaId, type);
    this.props.fetchMediaCastings(mediaId);
    this.props.fetchMedia(mediaId, type);
  }

  navigateTo = (scene) => {
    this.props.navigation.navigate(scene, {
      mediaId: this.props.mediaId,
      type: this.props.type,
    });
  }

  formatData(data, numberOfItems = 12) {
    return data.sort((a, b) => a - b).slice(0, numberOfItems);
  }

  render() {
    const { media, castings, reactions } = this.props;
    const series = media.type === 'anime' ? media.episodes || [] : media.chapters || [];
    const seriesCount = series.length;

    return (
      <SceneContainer>
        <EpisodesBox
          title={`Episodes・${seriesCount}`}
          data={this.formatData(series)}
          placeholderImage={media.posterImage.large}
          onViewAllPress={() => this.navigateTo('Episodes')}
        />
        <RelatedMediaBox
          contentDark
          title="More from this series"
          data={this.formatData(media.mediaRelationships)}
        />
        <ReactionsBox
          title="Reactions"
          titleAction={() => {}}
          titleLabel="Write reactions"
          reactedMedia={media.canonicalTitle}
          data={this.formatData(reactions)}
          onViewAllPress={() => this.navigateTo('Reactions')}
        />
        <CharactersBox
          contentDark
          title="Characters"
          data={this.formatData(castings)}
          onViewAllPress={() => this.navigateTo('Characters')}
        />
      </SceneContainer>
    );
  }
}

Summary.propTypes = {
  media: PropTypes.object.required,
};

Summary.defaultProps = {
  media: {},
};

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
