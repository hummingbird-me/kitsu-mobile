import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { MaskedImage, StyledText, MediaCard } from '../parts';
import { scenePadding } from '../constants';

const paddingOptions = {
  landscapeLarge: scenePadding,
  filled: scenePadding,
  landscape: scenePadding / 2,
  portrait: scenePadding / 2,
  portraitLarge: scenePadding,
  square: scenePadding / 2,
};

const TitleContainer = glamorous.view(
  {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  ({ variant }) => ({
    padding: paddingOptions[variant],
  }),
);

const ImageCard = ({ variant, noMask, borderRadius, title, subtitle, source }) => {
  const titleSize = variant === 'landscapeLarge' ? 'default' : 'small';
  const subtitleSize = variant === 'landscapeLarge' ? 'small' : 'xsmall';
  const label = (title || subtitle) && (
    <TitleContainer variant={variant}>
      {subtitle && <StyledText color="lightGrey" size={subtitleSize} numberOfLines={1}>{subtitle}</StyledText>}
      {title && <StyledText color="light" size={titleSize} bold numberOfLines={2} lineHeight={titleSize}>{title}</StyledText>}
    </TitleContainer>
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
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'landscapeSmall', 'portraitLarge', 'filled']),
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

export default ImageCard;
