import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { MaskedImage } from 'kitsu/screens/Profiles/components/MaskedImage';
import { MediaCard } from 'kitsu/screens/Profiles/components/MediaCard';
import { scenePadding } from 'kitsu/screens/Profiles/constants';
import { styles } from './styles';

const paddingOptions = {
  landscapeLarge: scenePadding,
  filled: scenePadding,
  landscape: scenePadding / 2,
  portrait: scenePadding / 2,
  portraitLarge: scenePadding,
  square: scenePadding / 2,
  thumbnail: scenePadding / 2,
};

export const ImageCard = ({
  variant,
  noMask,
  borderRadius,
  title,
  subtitle,
  source,
}) => {
  const titleSize = variant === 'landscapeLarge' ? 'default' : 'small';
  const subtitleSize = variant === 'landscapeLarge' ? 'small' : 'xsmall';
  const label = (title || subtitle) && (
    <View style={[styles.titleView, { padding: paddingOptions[variant] }]}>
      {subtitle && <StyledText color="lightGrey" size={subtitleSize} numberOfLines={1}>{subtitle}</StyledText>}
      {title && <StyledText color="light" size={titleSize} bold numberOfLines={2} lineHeight={titleSize}>{title}</StyledText>}
    </View>
  );
  return (
    <MediaCard variant={variant} borderRadius={borderRadius}>
      <MaskedImage
        maskedBottom={!noMask}
        source={source}
      />
      {label}
    </MediaCard>
  );
};

ImageCard.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'landscapeSmall', 'portraitLarge', 'thumbnail', 'filled']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  source: PropTypes.object,
  noMask: PropTypes.bool,
  borderRadius: PropTypes.number,
};

ImageCard.defaultProps = {
  variant: 'portrait',
  title: null,
  subtitle: null,
  source: {},
  noMask: false,
  borderRadius: 6,
};
