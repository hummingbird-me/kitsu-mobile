import React, { Component } from 'react';
import { View, TouchableOpacity, Image, SectionList } from 'react-native';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
} from 'kitsu/screens/Profiles/MediaPages/components';

import { PhotoGrid } from 'kitsu/screens/Profiles/MediaPages/components/PhotoGrid';
import { MaskedImage } from 'kitsu/screens/Profiles/MediaPages/parts';

class Characters extends Component {
  constructor() {
    super();
    this.state = { items: [] };
  }

  componentDidMount() {
    // Build an array of 60 photos
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return {
        id: i,
        src: `http://placehold.it/200x200?text=${i + 1}`,
      };
    });
    this.setState({ items });
  }

  renderItem(item, itemSize) {
    return (
      <TouchableOpacity
        key={item.id}
        style={{ width: itemSize, height: itemSize }}
        onPress={ () => {
          // Do Something
        }}>
        <Image
          resizeMode="cover"
          style={{ width: 200, height: 200 }}
          source={{ uri: item.src }}
        />
      </TouchableOpacity>
    )
  }

  renderCharacters = () => {
    if (!this.props.castings) return null;
    const { castings } = this.props;

    return (
      <PhotoGrid
        data={this.state.items}
        itemsPerRow={3}
        itemMargin={1}
        renderItem={this.renderItem}
      />
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
