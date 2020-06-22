import * as React from 'react';
import { Text, TouchableOpacity, View, ViewPropTypes, ActivityIndicator } from 'react-native';
import { PropTypes } from 'prop-types';
import { ProgressBar } from 'app/components/ProgressBar';
import { ProgressiveImage } from 'app/components/ProgressiveImage';
import { Rating } from 'app/components/Rating';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'app/navigation';
import { styles } from './styles';

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
  loading,
}) => {
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
  caption: PropTypes.string,
  cardDimensions: PropTypes.object.isRequired,
  cardStyle: ViewPropTypes.style,
  mediaData: PropTypes.object.isRequired,
  componentId: PropTypes.any,
  progress: PropTypes.number,
  ratingTwenty: PropTypes.number,
  ratingSystem: PropTypes.string,
  style: ViewPropTypes.style,
  loading: PropTypes.bool,
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
