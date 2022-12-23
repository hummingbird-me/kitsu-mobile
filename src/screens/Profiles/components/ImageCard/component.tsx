import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { isEmpty } from 'lodash';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { StyledText } from 'kitsu/components/StyledText';
import { cardSize } from 'kitsu/screens/Profiles/constants';

import { styles } from './styles';

const paddingOptions = {
  landscapeLarge: 14,
  filled: 14,
  landscape: 10,
  portrait: 8,
  portraitLarge: 10,
  square: 10,
  thumbnail: 10,
};

interface TextViewProps {
  variant?:
    | 'landscape'
    | 'portrait'
    | 'square'
    | 'landscapeLarge'
    | 'landscapeSmall'
    | 'portraitLarge'
    | 'thumbnail'
    | 'filled';
  title?: string;
  subtitle?: string;
  noMask?: boolean;
  boldTitle?: boolean;
  centerTitle?: boolean;
}

const TextView = ({
  variant,
  title,
  subtitle,
  boldTitle,
  centerTitle,
  noMask,
}: TextViewProps) => {
  const titleSize = variant === 'landscapeLarge' ? 'default' : 'xsmall';
  const subtitleSize = variant === 'landscapeLarge' ? 'small' : 'xxsmall';

  return (
    (!isEmpty(title) || !isEmpty(subtitle)) && (
      <View style={[styles.anchorBottom, { height: '60%' }]}>
        {!noMask && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.linearGradient}
          />
        )}
        <View
          style={[styles.anchorBottom, { padding: paddingOptions[variant] }]}
        >
          {!isEmpty(subtitle) && (
            <StyledText color="lightGrey" size={subtitleSize} numberOfLines={1}>
              {subtitle}
            </StyledText>
          )}
          {!isEmpty(title) && (
            <StyledText
              color="light"
              size={titleSize}
              bold={boldTitle}
              numberOfLines={2}
              lineHeight={titleSize}
              textStyle={centerTitle ? { textAlign: 'center' } : null}
              ellipsizeMode="tail"
            >
              {title}
            </StyledText>
          )}
        </View>
      </View>
    )
  );
};

TextView.defaultProps = {
  variant: 'portrait',
  title: null,
  subtitle: null,
  noMask: false,
  boldTitle: true,
  centerTitle: false,
};

interface ImageCardProps {
  variant?:
    | 'landscape'
    | 'portrait'
    | 'square'
    | 'landscapeLarge'
    | 'landscapeSmall'
    | 'portraitLarge'
    | 'thumbnail'
    | 'filled';
  title?: string;
  subtitle?: string;
  subheading?: string;
  source?: object;
  noMask?: boolean;
  boldTitle?: boolean;
  centerTitle?: boolean;
  style?: unknown;
  cardStyle?: unknown;
  onPress?(...args: unknown[]): unknown;
}

export const ImageCard = ({
  variant,
  noMask,
  title,
  subtitle,
  subheading,
  source,
  boldTitle,
  centerTitle,
  style,
  cardStyle,
  onPress,
}: ImageCardProps) => {
  const cardDimensions = {
    width: cardSize[variant].width,
    height: cardSize[variant].height,
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={onPress === null}>
      <View
        style={[
          styles.posterImageContainer,
          { width: cardDimensions.width },
          style,
        ]}
      >
        {source ? (
          <ProgressiveImage
            duration={500}
            source={source}
            style={[styles.posterImageCard, cardDimensions, cardStyle]}
          />
        ) : (
          <View style={[styles.posterImageCard, cardDimensions, cardStyle]} />
        )}
        <TextView
          variant={variant}
          title={title}
          subtitle={subtitle}
          boldTitle={boldTitle}
          centerTitle={centerTitle}
          noMask={noMask}
        />
      </View>
      {!isEmpty(subheading) && (
        <View style={{ width: cardDimensions.width, paddingTop: 4 }}>
          <Text numberOfLines={1} style={styles.subheading}>
            {subheading}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

ImageCard.propTypes = {
  style: ViewPropTypes.style,
  cardStyle: ViewPropTypes.style,
};

ImageCard.defaultProps = {
  variant: 'portrait',
  title: null,
  subtitle: null,
  subheading: null,
  source: {},
  noMask: false,
  boldTitle: true,
  centerTitle: false,
  style: null,
  cardStyle: null,
  onPress: null,
};
