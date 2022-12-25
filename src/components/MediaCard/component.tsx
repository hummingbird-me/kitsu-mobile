import * as React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Navigation } from 'react-native-navigation';

import { ProgressBar } from 'kitsu/components/ProgressBar';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { Rating } from 'kitsu/components/Rating';
import { Screens } from 'kitsu/navigation';

import { styles } from './styles';

type MediaCardProps = {
  caption?: string;
  cardDimensions: { width: number; height: number };
  cardStyle?: ViewStyle | null;
  mediaData: { id: string; type: string; posterImage: { small: string } };
  componentId?: string;
  progress?: number;
  ratingTwenty?: number;
  ratingSystem?: 'simple' | 'regular' | 'advanced';
  style?: ViewStyle | null;
  loading?: boolean;
};

export const MediaCard = ({
  caption = '',
  cardDimensions,
  cardStyle = null,
  mediaData,
  componentId,
  progress = 0,
  ratingTwenty = undefined,
  ratingSystem = 'simple',
  style = null,
  loading = false,
}: MediaCardProps) => {
  const onPress = () => {
    if (componentId && mediaData && mediaData.id && mediaData.type) {
      Navigation.push(componentId, {
        component: {
          name: Screens.MEDIA_PAGE,
          passProps: {
            mediaId: mediaData.id,
            mediaType: mediaData.type,
          },
        },
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={loading}>
      <View
        style={[
          styles.posterImageContainer,
          { width: cardDimensions.width },
          style,
        ]}>
        {mediaData && mediaData.posterImage ? (
          <ProgressiveImage
            duration={500}
            source={{ uri: mediaData.posterImage.small }}
            style={[styles.posterImageCard, cardDimensions, cardStyle]}
          />
        ) : (
          <View style={[styles.posterImageCard, cardDimensions, cardStyle]} />
        )}

        {caption.length > 0 && (
          <Text style={styles.captionText}>{caption}</Text>
        )}

        {progress > 0 && (
          <ProgressBar
            fillPercentage={progress}
            height={3}
            style={styles.progressBar}
          />
        )}

        {typeof ratingTwenty !== 'undefined' && (
          <Rating
            disabled
            ratingTwenty={ratingTwenty}
            ratingSystem={ratingSystem}
            size="tiny"
            viewType="single"
            showNotRated={false}
            style={styles.rating}
          />
        )}

        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
