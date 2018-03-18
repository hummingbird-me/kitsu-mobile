import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MediaCard } from 'kitsu/components/MediaCard';
import { styles } from './styles';

const MEDIA_CARD_DIMENSIONS = { width: 100, height: 150 };

const LandscapeMediaCard = ({ onPress, title, image, ...props }) => (
  <TouchableOpacity onPress={onPress} style={styles.landscapeImageContainer}>
    <FastImage
      source={image}
      {...props}
      style={styles.landscapeImage}
      borderRadius={8}
      resizeMode={'cover'}
    />
    {title && <Text style={styles.landscapeImageTitle}>{title}</Text>}
  </TouchableOpacity>
);

export const ItemRenderer = ({ item, type, ...props }) => {
  if (type === 'static') {
    return <LandscapeMediaCard {...item} />;
  }

  return <MediaCard cardDimensions={MEDIA_CARD_DIMENSIONS} mediaData={item} loading={type === 'loading'} {...props} />;
};
