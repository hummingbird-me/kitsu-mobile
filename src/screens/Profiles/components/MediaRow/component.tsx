import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { ImageCard } from 'kitsu/screens/Profiles/components/ImageCard';
import { StyledText } from 'kitsu/components/StyledText';
import { styles } from './styles';

export const MediaRow = ({
  imageVariant,
  title,
  summary,
  subtitle,
  thumbnail,
  summaryLines,
}) => (
  <View style={styles.row}>
    <ImageCard
      noMask
      variant={imageVariant}
      source={thumbnail}
    />
    <View style={styles.main}>
      <StyledText color="dark" size="small" bold>{title}</StyledText>
      {!!subtitle && (<StyledText color="grey" size="xsmall" bold style={{ marginTop: 2 }}>{subtitle}</StyledText>)}
      <StyledText color="grey" size="xsmall" numberOfLines={summaryLines} style={{ marginTop: 5 }}>{summary}</StyledText>
    </View>
  </View>
);


MediaRow.propTypes = {
  imageVariant: PropTypes.oneOf(['square', 'thumbnail', 'portrait', 'landscape', 'landscapeSmall']),
  title: PropTypes.string,
  summary: PropTypes.string,
  subtitle: PropTypes.string,
  thumbnail: PropTypes.object,
  summaryLines: PropTypes.number,
};

MediaRow.defaultProps = {
  imageVariant: 'portrait',
  title: '',
  summary: '',
  subtitle: '',
  thumbnail: {},
  summaryLines: 3,
};
