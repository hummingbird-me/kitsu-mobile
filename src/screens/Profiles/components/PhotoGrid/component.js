import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  View,
} from 'react-native';

import { scene, scenePadding } from 'kitsu/screens/Profiles/constants';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';

export class PhotoGrid extends React.Component {
  buildRows = (items, itemsPerRow) => (
    items.reduce((rows, item, idx) => {
      if (idx % itemsPerRow === 0 && idx > 0) rows.push([]);
      rows[rows.length - 1].push(item);
      return rows;
    }, [[]])
  )

  renderRow = (items, itemsPerRow, itemMargin) => {
    const deviceWidth = scene.width - (scenePadding * 2);

    const totalMargin = itemMargin * (itemsPerRow - 1);
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

  renderItem = (item, itemWidth, adjustedMargin) => {
    const character = item && item.character;
    const image = character && character.image && character.image.original;
    return (
      <View style={{
        width: itemWidth,
        height: itemWidth,
        marginRight: adjustedMargin,
      }}
      >
        <ImageCard
          variant="filled"
          borderRadius={0}
          title={(character && character.name) || '-'}
          source={{ uri: image || null }}
        />
      </View>
    );
  }

  render() {
    if (!this.props.photos) return null;
    const { photos } = this.props;
    const firstRows = this.buildRows(photos.slice(0, 2), 2);
    const remainingRows = this.buildRows(photos.slice(3), 3);

    return (
      <View style={{ paddingHorizontal: scenePadding, paddingBottom: scenePadding }}>
        <FlatList
          data={firstRows}
          renderItem={({ item }) => this.renderRow(item, 2, this.props.itemMargin)}
        />
        <FlatList
          data={remainingRows}
          renderItem={({ item }) => this.renderRow(item, 3, this.props.itemMargin)}
        />
      </View>
    );
  }
}

PhotoGrid.propTypes = {
  itemMargin: PropTypes.number,
  photos: PropTypes.array,
};

PhotoGrid.defaultProps = {
  itemMargin: 5,
  photos: [],
};
