import React, { Component } from 'react';
import { View, TouchableOpacity, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { connect } from 'react-redux';
import { fetchMedia, fetchMediaCastings } from 'kitsu/store/media/actions';
import {
  TabHeader,
  TabContainer,
  ImageCard,
} from 'kitsu/screens/Profiles/MediaPages/components';

import { scene, scenePadding } from '../constants';

class Characters extends Component {
  buildRows(items, itemsPerRow) {
    return items.reduce((rows, item, idx) => {
      // If a full row is filled create a new row array
      if (idx % itemsPerRow === 0 && idx > 0) rows.push([]);
      rows[rows.length - 1].push(item);
      return rows;
    }, [[]]);
  }

  renderRow(items, itemsPerRow) {
    // Calculate the width of a single item based on the device width
    // and the desired margins between individual items
    const deviceWidth = scene.width - (scenePadding * 2);
    const margin = 5;

    const totalMargin = margin * (itemsPerRow - 1);
    const itemWidth = Math.floor((deviceWidth - totalMargin) / itemsPerRow);
    const adjustedMargin = (deviceWidth - (itemsPerRow * itemWidth)) / (itemsPerRow - 1);

    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: adjustedMargin,
      }}
      >
        {items.map(item => this.renderItem(item, itemWidth, adjustedMargin))}
        {itemsPerRow - items.length > 0 && (
          <View style={{ width: itemWidth * (itemsPerRow - items.length) }} />
        )}
      </View>
    );
  }

  renderItem = (item, itemWidth, adjustedMargin) => (
    <View style={{ width: itemWidth, height: itemWidth, marginRight: adjustedMargin }}>
      <ImageCard
        variant="filled"
        borderRadius={0}
        title={item.character.name}
        source={{ uri: item.character.image.original }}
      />
    </View>
  );

  renderCharacters = () => {
    if (!this.props.castings) return null;
    const { castings } = this.props;
    const firstRows = this.buildRows(castings.slice(0, 2), 2);
    const remainingRows = this.buildRows(castings.slice(3), 3);

    return (
      <View style={{ paddingHorizontal: scenePadding, paddingBottom: scenePadding }}>
        <FlatList
          data={firstRows}
          renderItem={({ item }) => this.renderRow(item, 2)}
        />
        <FlatList
          data={remainingRows}
          renderItem={({ item }) => this.renderRow(item, 3)}
        />
      </View>
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
