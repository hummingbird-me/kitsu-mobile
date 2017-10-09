import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
} from 'kitsu/screens/Profiles/MediaPages/components';

import { PhotoGrid } from 'kitsu/screens/Profiles/MediaPages/components/PhotoGrid';

class Characters extends Component {
  renderCharacters = () => {
    if (!this.props.castings) return null;
    return (
      <PhotoGrid photos={this.props.castings} />
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

Characters.propTypes = {
  castings: PropTypes.object.required,
};

Characters.defaultProps = {
  castings: {},
};

const mapStateToProps = (state) => {
  const { media, castings } = state.media;
  const mediaId = 12;
  return {
    media: media[mediaId] || {},
    castings: castings[mediaId] || [],
  };
};

export default connect(mapStateToProps, {
  fetchMedia,
  fetchMediaCastings,
})(Characters);
