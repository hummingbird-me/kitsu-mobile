import React from 'react';
import { View } from 'react-native';

import { StyledText } from 'kitsu/components/StyledText';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';

import { styles } from './styles';

interface MediaRowProps {
  imageVariant?:
    | 'square'
    | 'thumbnail'
    | 'portrait'
    | 'landscape'
    | 'landscapeSmall';
  title?: string;
  summary?: string;
  subtitle?: string;
  thumbnail?: object;
  summaryLines?: number;
}

export const MediaRow = ({
  imageVariant,
  title,
  summary,
  subtitle,
  thumbnail,
  summaryLines,
}: MediaRowProps) => (
  <View style={styles.row}>
    <ImageCard noMask variant={imageVariant} source={thumbnail} />
    <View style={styles.main}>
      <StyledText color="dark" size="small" bold>
        {title}
      </StyledText>
      {!!subtitle && (
        <StyledText color="grey" size="xsmall" bold style={{ marginTop: 2 }}>
          {subtitle}
        </StyledText>
      )}
      <StyledText
        color="grey"
        size="xsmall"
        numberOfLines={summaryLines}
        style={{ marginTop: 5 }}
      >
        {summary}
      </StyledText>
    </View>
  </View>
);

MediaRow.defaultProps = {
  imageVariant: 'portrait',
  title: '',
  summary: '',
  subtitle: '',
  thumbnail: {},
  summaryLines: 3,
};
