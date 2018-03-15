import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { styles } from './styles';

const StyledImage = ({ ...props }) => <FastImage style={styles.imageView} {...props} />;

export const MaskedImage = ({
  maskedTop = false,
  maskedBottom = false,
  overlay = false,
  resizeMode = 'cover',
  source = {},
  progressive,
}) => {
  const ImageComponent = progressive ? StyledProgressiveImage : StyledImage;
  return (
    <View style={styles.wrap}>
      <ImageComponent
        resizeMode={resizeMode}
        source={source}
      />
      {maskedTop && <LinearGradient colors={['rgba(0,0,0,0.9)', 'transparent']} style={[styles.gradient, styles.gradient__top]} />}
      {maskedBottom && <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={[styles.gradient, styles.gradient__bottom]} />}
      {overlay && <View style={styles.overlay} />}
    </View>
  );
};

MaskedImage.propTypes = {
  maskedTop: PropTypes.bool,
  maskedBottom: PropTypes.bool,
  progressive: PropTypes.bool,
  overlay: PropTypes.bool,
  resizeMode: PropTypes.string,
  source: PropTypes.object,
};

MaskedImage.defaultProps = {
  maskedTop: false,
  maskedBottom: false,
  progressive: false,
  overlay: false,
  resizeMode: 'cover',
  source: {},
};
