import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MediaCard } from 'kitsu/components/MediaCard';
import { styles } from './styles';

const MEDIA_CARD_DIMENSIONS = { height: 120, width: 80 };

const LandscapeMediaCard = ({ onPress, title, image, ...props }) => (
  <TouchableOpacity onPress={onPress} style={styles.landscapeImageContainer}>
    <Image source={image} {...props} style={styles.landscapeImage} />
    {title && <Text style={styles.landscapeImageTitle}>{title}</Text>}
  </TouchableOpacity>
);

export const ItemRenderer = ({ item, type, ...props }) => {
  if (type === 'static') {
    return <LandscapeMediaCard {...item} />;
  }
  return <MediaCard cardDimensions={MEDIA_CARD_DIMENSIONS} mediaData={item} {...props} />;
};
