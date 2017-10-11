import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
} from 'kitsu/screens/Profiles/components';

import { PhotoGrid } from 'kitsu/screens/Profiles/components/PhotoGrid';

class Characters extends Component {
  static propTypes = {
    castings: PropTypes.object.isRequired,
  }

  static defaultProps = {
    castings: {},
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
