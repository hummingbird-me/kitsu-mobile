import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { StyledText } from 'kitsu/components/StyledText';
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

interface MediaTagProps {
  media: {
    canonicalTitle: string;
  };
  episode?: {
    number: number;
  };
  componentId: any;
  disabled?: boolean;
  style?: unknown;
}

export const MediaTag = ({
  disabled,
  media,
  episode,
  componentId,
  style,
}: MediaTagProps) => {
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
            <StyledText
              color="green"
              size="xxsmall"
            >{`${episodePrefix} ${episode.number}`}</StyledText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

MediaTag.propTypes = {
  style: ViewPropTypes.style,
};

MediaTag.defaultProps = {
  episode: null,
  disabled: false,
  style: null,
};
