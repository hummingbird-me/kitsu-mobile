import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as colors from '../constants/colors';
import { defaultAvatar } from '../constants/app';

let i = 0;
const genKey = () => `key:${++i}`;

class ProgressiveImage extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      key: genKey(),
      mainLoaded: false,
      width: 0,
      height: 0,
    };
  }

  // componentDidMount() {
  //   console.log('mounted');
  // }

  // componentWillUnmount() {
  //   console.log('unmount');
  // }

  onLoad = () => {
    // console.log(this.state);
    if (!this.state.mainLoaded) {
      Animated.timing(this.state.thumbnailOpacity, {
        toValue: 1,
        duration: 300,
      }).start();
      this.setState({ mainLoaded: true });
      // console.log(this.state);
    }
  };

  render() {
    const { key, thumbnailOpacity } = this.state;
    const { source, style, resizeMode, hasOverlay } = this.props;
    // console.log(this.state);
    return (
      <View
        style={{ backgroundColor: colors.imageGrey, ...style }}
        onLayout={e =>
          this.setState({ height: e.nativeEvent.layout.height, width: e.nativeEvent.layout.width })}
      >
        {source.uri &&
          <Animated.Image
            resizeMode={resizeMode}
            key={key}
            style={[
              style,
              {
                opacity: thumbnailOpacity,
              },
            ]}
            source={{ uri: source.uri ? source.uri : '' }}
            onLoad={this.onLoad}
          />}
        {hasOverlay &&
          source.uri &&
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={{
              height: this.state.height,
              width: this.state.width,
              position: 'absolute',
              top: 0,
            }}
          />}
      </View>
    );
  }
}

ProgressiveImage.propTypes = {
  source: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  resizeMode: PropTypes.string,
  hasOverlay: PropTypes.bool,
};

ProgressiveImage.defaultProps = {
  resizeMode: 'cover',
  hasOverlay: false,
};

export default ProgressiveImage;
