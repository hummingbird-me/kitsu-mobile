import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { StyledText } from '@/components/StyledText';
import { useStackNavigation } from '@/contexts/StackNavigationContext';

import { styles } from './styles';

type MediaTagProps = {
  media: {
    canonicalTitle: string;
    type: 'anime' | 'manga';
    id: string;
  };
  episode?: {
    number: number;
  };
  componentId: any;
  disabled?: boolean;
  style?: ViewStyle;
};

export const MediaTag = ({
  disabled,
  media,
  episode,
  style,
}: MediaTagProps) => {
  const navigation = useStackNavigation();
  const episodePrefix = media.type === 'anime' ? 'E' : 'CH';

  return media ? (
    <View style={[styles.mediaTagView, style]}>
      <TouchableOpacity
        disabled={disabled}
        onPress={() =>
          navigation.push('Media', { type: media.type, id: media.id })
        }
        style={styles.mediaTag}>
        <StyledText color="green" size="xxsmall">
          {media.canonicalTitle}
        </StyledText>
      </TouchableOpacity>
      {episode && (
        <TouchableOpacity
          disabled={disabled}
          onPress={() =>
            navigation.push('Unit', { type: media.type, id: media.id })
          }
          style={styles.episodeTagView}>
          <View style={styles.episodeTagLine} />
          <View style={styles.mediaTag}>
            <StyledText
              color="green"
              size="xxsmall">{`${episodePrefix} ${episode.number}`}</StyledText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
};
