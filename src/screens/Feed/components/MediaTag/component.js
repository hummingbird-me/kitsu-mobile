import React from 'react';
import { View, TouchableOpacity, ViewPropTypes } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import PropTypes from 'prop-types';
import { Navigation } from 'react-native-navigation';
import { Screens } from 'kitsu/navigation';
import { styles } from './styles';

const navigateToMedia = (media, componentId) => {
  if (media) {
    Navigation.push(componentId, {
      component: {
        name: Screens.MEDIA_PAGE,
        passProps: { mediaId: media.id, mediaType: media.type },
      },
    });
  }
};

export const MediaTag = ({ disabled, media, episode, componentId, style }) => {
  if (!media) return null;
  const episodePrefix = media.type === 'anime' ? 'E' : 'CH';
  return (
    <View style={[styles.mediaTagView, style]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => navigateToMedia(media, componentId)}
        style={styles.mediaTag}
      >
        <StyledText color="green" size="xxsmall">
          {media.canonicalTitle}
        </StyledText>
      </TouchableOpacity>
      {episode && (
        <TouchableOpacity
          disabled={disabled}
          onPress={() => navigateToMedia(media, componentId)}
          style={styles.episodeTagView}
        >
          <View style={styles.episodeTagLine} />
          <View style={styles.mediaTag}>
            <StyledText color="green" size="xxsmall">{`${episodePrefix} ${episode.number}`}</StyledText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

MediaTag.propTypes = {
  media: PropTypes.shape({
    canonicalTitle: PropTypes.string.isRequired,
  }).isRequired,
  episode: PropTypes.shape({
    number: PropTypes.number.isRequired,
  }),
  componentId: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
};

MediaTag.defaultProps = {
  episode: null,
  disabled: false,
  style: null,
};
