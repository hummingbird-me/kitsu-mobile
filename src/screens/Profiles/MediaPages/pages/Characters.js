import React, { Component } from 'react';
import { View, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
} from '../components';

class Characters extends Component {
  renderCharacters = () => {
    if (!this.props.castings) return null;
    const { castings } = this.props;

    return null;
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
