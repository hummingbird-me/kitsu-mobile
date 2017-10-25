import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import { TabHeader } from 'kitsu/screens/Profiles/components/TabHeader';
import { TabContainer } from 'kitsu/screens/Profiles/components/TabContainer';
import { PhotoGrid } from 'kitsu/screens/Profiles/components/PhotoGrid';

class Characters extends Component {
  static propTypes = {
    castings: PropTypes.array.isRequired,
  }

  static defaultProps = {
    castings: null,
  }

  renderCharacters = () => {
    const { castings } = this.props;
    if (!castings) return null;

    return (
      <PhotoGrid photos={castings} />
    );
  }

  render() {
    return (
      <TabContainer light padded>
        <TabHeader title="Characters" contentDark />
        {this.renderCharacters()}
      </TabContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { media, castings } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
    castings: castings[mediaId] || [],
  };
};

export const component = connect(mapStateToProps, {
  fetchMedia,
  fetchMediaCastings,
})(Characters);
