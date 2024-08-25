import { Image, ImageContentFit } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';

import { commonStyles } from '@/common/styles';

import { styles } from './styles';

type ProgressiveImageProps = {
  backgroundStyle?: object;
  children?: React.ReactNode;
  duration?: number;
  style?: any;
  resizeMode?: ImageContentFit;
  source: any;
  defaultSource?: number;
  hasOverlay?: boolean;
};

export class ProgressiveImage extends PureComponent<ProgressiveImageProps> {
  static defaultProps = {
    backgroundStyle: undefined,
    children: undefined,
    duration: 300,
    style: undefined,
    resizeMode: 'cover',
    defaultSource: undefined,
    hasOverlay: false,
  };

  state = {
    thumbnailOpacity: new Animated.Value(0),
    width: 0,
    height: 0,
  };

  onLoad = () => {
    if (!this.hasFadedIn) {
      Animated.timing(this.state.thumbnailOpacity, {
        toValue: 1,
        duration: this.props.duration,
        useNativeDriver: true,
      }).start();

      this.hasFadedIn = true;
    }
  };

  onLayout = (event) => {
    const { height, width } = event.nativeEvent.layout;

    if (this.state.height !== height || this.state.width !== width) {
      this.setState({ height, width });
    }
  };

  hasFadedIn = false;

  render() {
    const { thumbnailOpacity } = this.state;
    const {
      backgroundStyle,
      children,
      style,
      resizeMode,
      source,
      defaultSource,
      hasOverlay,
    } = this.props;

    return (
      <View style={[styles.imageBackground, backgroundStyle, style]}>
        {source && (
          <Image
            onLoad={this.onLoad}
            onLayout={this.onLayout}
            contentFit={resizeMode}
            source={source || defaultSource}
            style={[style, { opacity: thumbnailOpacity.Value }]}
          />
        )}

        {(children || hasOverlay) && source.uri && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={[commonStyles.absoluteFill, style]}>
            {children}
          </LinearGradient>
        )}
      </View>
    );
  }
}
