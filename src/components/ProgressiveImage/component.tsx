import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import { commonStyles } from 'kitsu/common/styles';

import { styles } from './styles';

interface ProgressiveImageProps {
  backgroundStyle?: object;
  children?: object;
  duration?: number;
  style?: any;
  resizeMode?: string;
  source: any;
  defaultSource?: number;
  hasOverlay?: boolean;
}

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
          <FastImage
            onLoad={this.onLoad}
            onLayout={this.onLayout}
            resizeMode={resizeMode}
            source={source || defaultSource}
            style={[style, { opacity: thumbnailOpacity.Value }]}
            cache="web"
          />
        )}

        {(children || hasOverlay) && source.uri && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={[commonStyles.absoluteFill, style]}
          >
            {children}
          </LinearGradient>
        )}
      </View>
    );
  }
}
