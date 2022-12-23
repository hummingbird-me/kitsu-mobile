import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { StyledProgressiveImage } from 'kitsu/screens/Profiles/components/StyledProgressiveImage';
import { styles } from './styles';

const StyledImage = ({ ...props }) => <FastImage style={styles.imageView} {...props} cache="web" />;

interface MaskedImageProps {
  maskedTop?: boolean;
  maskedBottom?: boolean;
  progressive?: boolean;
  overlay?: boolean;
  resizeMode?: string;
  source?: object;
}

export const MaskedImage = ({
  maskedTop = false,
  maskedBottom = false,
  overlay = false,
  resizeMode = 'cover',
  source = {},
  progressive
}: MaskedImageProps) => {
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

MaskedImage.defaultProps = {
  maskedTop: false,
  maskedBottom: false,
  progressive: false,
  overlay: false,
  resizeMode: 'cover',
  source: {},
};
