import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import * as colors from '../constants/colors';

let i = 0;
const genKey = () => `key:${++i}`;

class ProgressiveImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      key: genKey(),
      mainLoaded: false,
    };
  }

  onLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 300,
    }).start();
  };

  render() {
    const { key, thumbnailOpacity } = this.state;
    const { source, style } = this.props;
    return (
      <View style={{ backgroundColor: colors.imageGrey, ...style }}>
        <Animated.Image
          resizeMode={'cover'}
          key={key}
          style={[
            style,
            {
              opacity: thumbnailOpacity,
            },
          ]}
          source={source}
          onLoad={this.onLoad}
        />
      </View>
    );
  }
}

ProgressiveImage.propTypes = {
  source: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
};

export default ProgressiveImage;
