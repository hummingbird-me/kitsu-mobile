import * as React from 'react';
import { Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { PropTypes } from 'prop-types';
import { ProgressBar } from 'kitsu/components/ProgressBar';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { Rating } from 'kitsu/components/Rating';
import { styles } from './styles';

export const MediaCard = ({
  caption,
  cardDimensions,
  cardStyle,
  mediaData,
  navigate,
  progress,
  ratingTwenty,
  ratingSystem,
  style,
}) => {
  const onPress = () => {
    navigate('MediaPages', {
      mediaId: mediaData.id,
      mediaType: mediaData.type,
    });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.posterImageContainer, { width: cardDimensions.width }, style]}>
        {mediaData.posterImage ? (
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
      </View>
    </TouchableOpacity>
  );
};

MediaCard.propTypes = {
  caption: PropTypes.string,
  cardDimensions: PropTypes.object.isRequired,
  cardStyle: ViewPropTypes.style,
  mediaData: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  progress: PropTypes.number,
  ratingTwenty: PropTypes.number,
  ratingSystem: PropTypes.string,
  style: ViewPropTypes.style,
};

MediaCard.defaultProps = {
  caption: '',
  cardStyle: null,
  progress: 0,
  ratingTwenty: undefined,
  ratingSystem: 'simple',
  style: null,
};
