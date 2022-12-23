import { isEmpty } from 'lodash';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import * as Layout from 'kitsu/screens/Feed/components/Layout';

import { styles } from './styles';

interface MediaItemProps {
  media: object;
  onClear(...args: unknown[]): unknown;
  disabled?: boolean;
  episode?: {
    number: number;
  };
}

export const MediaItem = ({
  media,
  episode,
  onClear,
  disabled,
}: MediaItemProps) => {
  const episodePrefix = media.type === 'manga' ? 'CH' : 'EP';
  const episodeTitle =
    (episode &&
      !isEmpty(episode.canonicalTitle) &&
      `- ${episode.canonicalTitle}`) ||
    '';

  return (
    <View style={styles.container}>
      <Layout.RowWrap alignItems="center">
        <ProgressiveImage
          source={{ uri: media && media.posterImage && media.posterImage.tiny }}
          style={[styles.image, episode && styles.image_episode]}
        />
        <Layout.RowMain>
          <StyledText color="dark" size="small" numberOfLines={2} bold>
            {media.canonicalTitle || 'Title'}
          </StyledText>
          <StyledText color="dark" size="xsmall" numberOfLines={3}>
            {media.synopsis || 'Synopsis'}
          </StyledText>
        </Layout.RowMain>
        {!disabled && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <Icon name="close" style={styles.icon} />
          </TouchableOpacity>
        )}
      </Layout.RowWrap>
      {episode && (
        <View style={styles.episodeTag}>
          <StyledText color="dark" size="xsmall" numberOfLines={1}>
            {`${episodePrefix} ${episode.number} ${episodeTitle}`}
          </StyledText>
        </View>
      )}
    </View>
  );
};

MediaItem.defaultProps = {
  disabled: false,
  episode: null,
};
