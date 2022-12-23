import * as React from 'react';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { Rating } from 'kitsu/components/Rating';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

interface MediaCardProps {
  caption?: string;
  cardDimensions: object;
  cardStyle?: unknown;
  mediaData: object;
  componentId?: any;
  progress?: number;
  ratingTwenty?: number;
  ratingSystem?: string;
  style?: unknown;
  loading?: boolean;
}

export const MediaCard = ({
  caption,
  cardDimensions,
  cardStyle,
  mediaData,
  componentId,
  progress,
  ratingTwenty,
  ratingSystem,
  style,
  loading
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
      <View style={[styles.posterImageContainer, { width: cardDimensions.width }, style]}>
        {mediaData && mediaData.posterImage ? (
          <ProgressiveImage
            duration={500}
            source={{ uri: mediaData.posterImage.small }}
            style={[styles.posterImageCard, cardDimensions, cardStyle]}
          />
        ) : (
          <View style={[styles.posterImageCard, cardDimensions, cardStyle]} />
        )}

        {caption.length > 0 && <Text style={styles.captionText}>{caption}</Text>}

        {progress > 0 && (
          <ProgressBar fillPercentage={progress} height={3} style={styles.progressBar} />
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

        {loading &&
          <View style={styles.loading}>
            <ActivityIndicator color={'rgba(255,255,255,0.6)'} />
          </View>
        }

      </View>
    </TouchableOpacity>
  );
};

MediaCard.propTypes = {
  cardStyle: ViewPropTypes.style,
  style: ViewPropTypes.style
};

MediaCard.defaultProps = {
  caption: '',
  cardStyle: null,
  progress: 0,
  ratingTwenty: undefined,
  ratingSystem: 'simple',
  style: null,
  loading: false,
  componentId: null,
};
