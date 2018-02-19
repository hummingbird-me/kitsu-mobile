import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, ViewPropTypes, Text } from 'react-native';
import { StyledText } from 'kitsu/components/StyledText';
import { ProgressiveImage } from 'kitsu/components/ProgressiveImage';
import { cardSize } from 'kitsu/screens/Profiles/constants';
import LinearGradient from 'react-native-linear-gradient';
import { isEmpty } from 'lodash';
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

const TextView = ({ variant, title, subtitle, boldTitle, centerTitle, noMask }) => {
  const titleSize = variant === 'landscapeLarge' ? 'default' : 'xsmall';
  const subtitleSize = variant === 'landscapeLarge' ? 'small' : 'xxsmall';

  return (!isEmpty(title) || !isEmpty(subtitle)) && (
    <View style={[styles.anchorBottom, { height: '60%' }]}>
      { !noMask && <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.linearGradient} />}
      <View style={[styles.anchorBottom, { padding: paddingOptions[variant] }]}>
        {!isEmpty(subtitle) && <StyledText color="lightGrey" size={subtitleSize} numberOfLines={1}>{subtitle}</StyledText>}
        {!isEmpty(title) &&
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
        }
      </View>
    </View>
  );
};

TextView.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'landscapeSmall', 'portraitLarge', 'thumbnail', 'filled']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  noMask: PropTypes.bool,
  boldTitle: PropTypes.bool,
  centerTitle: PropTypes.bool,
};

TextView.defaultProps = {
  variant: 'portrait',
  title: null,
  subtitle: null,
  noMask: false,
  boldTitle: true,
  centerTitle: false,
};

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
}) => {
  const cardDimensions = {
    width: cardSize[variant].width,
    height: cardSize[variant].height,
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={onPress === null}>
      <View style={[styles.posterImageContainer, { width: cardDimensions.width }, style]}>
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
        </View>)
      }
    </TouchableOpacity>
  );
};

ImageCard.propTypes = {
  variant: PropTypes.oneOf(['landscape', 'portrait', 'square', 'landscapeLarge', 'landscapeSmall', 'portraitLarge', 'thumbnail', 'filled']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  subheading: PropTypes.string,
  source: PropTypes.object,
  noMask: PropTypes.bool,
  boldTitle: PropTypes.bool,
  centerTitle: PropTypes.bool,
  style: ViewPropTypes.style,
  cardStyle: ViewPropTypes.style,
  onPress: PropTypes.func,
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
